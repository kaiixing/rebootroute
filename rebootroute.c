#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<math.h>
#include<sys/types.h>
#include<sys/socket.h>
#include<errno.h>
#include<netinet/in.h>
#include<arpa/inet.h>
#include<openssl/md5.h>
#include<sys/timeb.h>
#define SRV_PORT 80  //server port
#define SRV_IP "192.168.21.1"  //server ip


//hex_md5,for get md5 value from string,out is char out[33]
char* hex_md5(char* str,char *out)
{
	unsigned char md[16]={0};
	MD5_CTX ctx;
	MD5_Init(&ctx);
	MD5_Update(&ctx,str,strlen(str));
	MD5_Final(md,&ctx);
	int i=0;
	char tmp[3]={0};
	for(i=0;i<16;i++)
	{
		sprintf(tmp,"%02x",md[i]);
		strcat(out,tmp);
	}
	return out;
}

// Make the response in url,get cnonce,response
char * MakeResponse(char *Innonce,char *cnonce,char *Response)
{
	//unsigned char md[17]={0};
	struct timeb tb;  // intent to get millseconds since 1970:00:00:00 UTC

	ftime(&tb);
	int  r=(int)ceil(fabs(sin(rand()%100+1))*100001);
	char strbuf[33]={0};
	char strtmp[33]={0};
	char urlres[128]={0};
	sprintf(strbuf,"%d%ld",r,tb.time*1000+tb.millitm);
	printf("use hex_md5 result:%s\n",hex_md5(strbuf,strtmp));
	memset(strtmp+16,0,16);
	strcpy(cnonce,strtmp);//get cnonce,front 16 chars of strtmp
	printf("Make a cnonce is :%s\n",cnonce);

	sprintf(urlres,"07851e12295ecbd45d774f59ff362f50:%s:00000001:%s:auth:202fe3ae6688ea0a29cec56f47556821",Innonce,strtmp);
	printf("Make a response in MakeResponse:%s\n",hex_md5(urlres,Response));
	return Response;
}

//send string and recv http header
int SendAndRecvHeader(char *sendstr,char *recvstr,int recvlen,int sock)
{	
	int markfirst=1;
	char *buff=malloc(1024*20);
	if(NULL==buff)
	{
		printf("malloc in SendAndRecvHeader fail\n");
		return -1;
	}

	memset(recvstr,0,recvlen);
	int ret=send(sock,sendstr,strlen(sendstr),0);
	printf("send header success:%d...,header:\n---------------------send\n%s\n---------------------send\n",ret,sendstr);

	while(recv(sock,buff,recvlen,0)>0)
	{
		if(strstr(buff,"\r\n\r\n")!=NULL&&markfirst==1)  //only print http header
		{
			memset(strstr(buff,"\r\n\r\n"),0,10);
			sprintf(recvstr,"%s",buff);
			memset(buff,0,1024*20);
			markfirst=0;
			//break;
		}
		else
		{
			//printf("recv data length :%d\n",strlen(buff));
			memset(buff,0,1024*20);
			continue;
		}
	}
	free(buff);


	return 0;
}
//connect to srv,return new sock for send next request
int GetOneSock()
{
	int s=socket(AF_INET,SOCK_STREAM,0);
	if(-1==s)
	{
		printf("connect fail:%s\n",strerror(errno));
		return -1;
	}
	printf("create socket success\n");
	//2.ParPare Address
	int addrlen=0;
	struct sockaddr_in sv_addr;
	addrlen=sizeof(sv_addr);
	memset(&sv_addr,0,sizeof(struct sockaddr_in));
	sv_addr.sin_family=AF_INET;
	sv_addr.sin_port=htons(SRV_PORT);
	sv_addr.sin_addr.s_addr=inet_addr(SRV_IP);
	//3.connect to srv
	if(-1==connect(s,(const struct sockaddr*)&sv_addr,addrlen))
	{
		printf("connect %s fail:%s\n",SRV_IP,strerror(errno));
		close(s);
		return -1;

	}
	return s;

}


int main(int argc,char** argv)
{


	srand(time(NULL));

	//1.Create socket fd
	int s=socket(AF_INET,SOCK_STREAM,0);
	if(-1==s)
	{
		printf("connect fail:%s\n",strerror(errno));
		return -1;
	}
	printf("create socket success\n");
	//2.ParPare Address
	int addrlen=0;
	struct sockaddr_in sv_addr;
	addrlen=sizeof(sv_addr);
	memset(&sv_addr,0,sizeof(struct sockaddr_in));
	sv_addr.sin_family=AF_INET;
	sv_addr.sin_port=htons(SRV_PORT);
	sv_addr.sin_addr.s_addr=inet_addr(SRV_IP);
	//3.connect to srv
	if(-1==connect(s,(const struct sockaddr*)&sv_addr,addrlen))
	{
		printf("connect %s fail:%s\n",SRV_IP,strerror(errno));
		close(s);
		return -1;

	}
	printf("connect srv success...\n");
	//4.open index
	char* buff=malloc(1024*20);
	char* bufrecv=malloc(1024*20);
	memset(buff,0,1024*20);
	memset(bufrecv,0,1024*20);
	SendAndRecvHeader("GET / HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0.12) Gecko/20130104 Firefox/10.0.12\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\n\r\n",bufrecv,1024*20,s);
	printf("\n--------------------------recv\n%s\n---------------------------recv\n",bufrecv);

	//5.login
	//get nonce
	memset(buff,0,1024*20);
	memset(bufrecv,0,1024*20);
	struct timeb tb;  // intent to get millseconds since 1970:00:00:00 UTC
	ftime(&tb);
	sprintf(buff,"GET /login.cgi?_=%ld HTTP/1.1\r\nHost: 192.168.21.1\r\nProxy-Connection: keep-alive\r\nCache-Control: no-store, no-cache, must-revalidate\r\nAccept: */*\r\nPragma: no-cache\r\nX-Requested-With: XMLHttpRequest\r\nUser-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36\r\nExpires: -1\r\nReferer: http://192.168.21.1/\r\nAccept-Encoding: gzip,deflate,sdch\r\nAccept-Language: zh-CN,zh;q=0.8\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n",tb.time*1000+tb.millitm);
	printf("begin send login.cgi?_=15918834374...\n\n------------------------%s-------------------\n\n\n",buff);
	SendAndRecvHeader(buff,bufrecv,1024*20,GetOneSock());
	printf("\n--------------------------recv\n%s\n---------------------------recv\n",bufrecv);
	char *nonce_start=strstr(bufrecv,"nonce=")+7;
	char *nonce_end=strstr(bufrecv,"qop=")-3;
	char nonce[10]={0}; //get from http response header
	char cnonce[17]={0}; //cnonce,front 16 chars of AuthCnonce
	char response[33]={0};//make from MakeResponse
	printf("%x--------------------------%x,end-start=%d\n",nonce_start,nonce_end,nonce_end-nonce_start);
	strncpy(nonce,nonce_start,nonce_end-nonce_start);
	printf("get nonce:%s\n",nonce);
	MakeResponse(nonce,cnonce,response);  //get nonce,cnonce,response
	//Make Login header
	ftime(&tb);
	memset(buff,0,1024*20);
	memset(bufrecv,0,1024*20);
	sprintf(buff,"GET /login.cgi?Action=Digest&username=admin&realm=Highwmg&nonce=%s&response=%s&qop=auth&cnonce=%s&temp=marvell&_=%ld HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0.12) Gecko/20130104 Firefox/10.0.12\r\nAccept: */*\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nAuthorization: Digest username=\"admin\", realm=\"Highwmg\", nonce=\"%s\", uri=\"/cgi/xml_action.cgi\", response=\"%s\", qop=auth, nc=00000003, cnonce=\"%s\"\r\nExpires: -1\r\nCache-Control: no-store, no-cache, must-revalidate\r\nPragma: no-cache\r\nX-Requested-With: XMLHttpRequest\r\nReferer: http://192.168.21.1/\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n",nonce,response,cnonce,tb.time*1000+tb.millitm,nonce,response,cnonce);
	printf("\nbegin login request headers:%s\n",buff);
	SendAndRecvHeader(buff,bufrecv,1024*20,GetOneSock());
	printf("\n--------------------------recv\n%s\n---------------------------recv\n",bufrecv);
	//begin to restart reboot
	memset(buff,0,1024*20);
	memset(bufrecv,0,1024*20);
	memset(cnonce,0,17);
	memset(response,0,33);
	MakeResponse(nonce,cnonce,response);  //get nonce,cnonce,response
	sprintf(buff,"GET /xml_action.cgi?method=get&module=duster&file=reset HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0.12) Gecko/20130104 Firefox/10.0.12\r\nAccept: application/xml, text/xml, */*; q=0.01\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nAuthorization: Digest username=\"admin\", realm=\"Highwmg\", nonce=\"%s\", uri=\"/cgi/xml_action.cgi\", response=\"%s\", qop=auth, nc=00000008, cnonce=\"%s\"\r\nX-Requested-With: XMLHttpRequest\r\nReferer: http://192.168.21.1/\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n",nonce,response,cnonce);
	SendAndRecvHeader(buff,bufrecv,1024*20,GetOneSock());
	printf("\n--------------------------recv\n%s\n---------------------------recv\n",bufrecv);
	free(buff);
	free(bufrecv);
	close(s);

	return 0;
}


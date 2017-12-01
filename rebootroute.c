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

// Make the response in url
char * MakeAuthCnonce(char *Authdst)
{
	unsigned char md[16]={0};
	struct timeval tv;  // intent to get millseconds since 1970:00:00:00 UTC
	gettimeofday(&tv,NULL);
	int  r=(int)ceil(fabs(sin(rand()%100+1))*100001);
	char strbuf[32]={0};
	printf("RAND_MAX=%d\ntv=%ld\nr=%d\n",RAND_MAX,tv.tv_sec*1000+tv.tv_usec/1000,r);
	sprintf(strbuf,"%d%ld",r,tv.tv_sec*1000+tv.tv_usec/1000);
	printf("comp:%s\n",strbuf);

	char out[33]={0};
	printf("use hex_md5 result:%s\n",hex_md5(strbuf,out));
	memcpy(Authdst,out,33);
	return Authdst;
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
	printf("send header success:%d...,header:\n%s\n",ret,sendstr);

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
			printf("recv data length :%d\n",strlen(buff));
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
        printf("%s\n",bufrecv);

	//5.login
	//get nonce
	memset(buff,0,1024*20);
	memset(bufrecv,0,1024*20);
        struct timeval tv;  // intent to get millseconds since 1970:00:00:00 UTC
        gettimeofday(&tv,NULL);
sprintf(buff,"GET /login.cgi?_=%ld HTTP/1.1\r\nHost: 192.168.21.1\r\nProxy-Connection: keep-alive\r\nCache-Control: no-store, no-cache, must-revalidate\r\nAccept: */*\r\nPragma: no-cache\r\nX-Requested-With: XMLHttpRequest\r\nUser-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36\r\nExpires: -1\r\nReferer: http://192.168.21.1/\r\nAccept-Encoding: gzip,deflate,sdch\r\nAccept-Language: zh-CN,zh;q=0.8\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n",tv.tv_sec*1000+tv.tv_usec/1000);
printf("begin send login.cgi?_=...\n");
	strcpy(buff,"GET /login.cgi?_=1510628282798 HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nX-Requested-With: XMLHttpRequest\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n");
SendAndRecvHeader(buff,bufrecv,1024*20,GetOneSock());
printf("%s\n",bufrecv);
getchar();
return 0;

	//strcpy(buff,"GET /login.cgi?_=1510628282798 HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nX-Requested-With: XMLHttpRequest\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n");
	//	strcpy(buff,"GET /login.cgi?_=1520628289768 HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0.12) Gecko/20130104 Firefox/10.0.12\r\nAccept: */*\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nExpires: -1\r\nCache-Control: no-store, no-cache, must-revalidate\r\nPragma: no-cache\r\nX-Requested-With: XMLHttpRequest\r\nReferer: http://192.168.21.1/\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n");
	//strcpy(buff,"GET /login.cgi?_=1510912327128 HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0.12) Gecko/20130104 Firefox/10.0.12\r\nAccept: */*\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nExpires: -1\r\nCache-Control: no-store, no-cache, must-revalidate\r\nPragma: no-cache\r\nX-Requested-With: XMLHttpRequest\r\nReferer: http://192.168.21.1/\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n");
	//make response str
	char response[33]={0};

	strcpy(buff,"GET /xml_action.cgi?method=get&module=duster&file=qs_complete HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0.12) Gecko/20130104 Firefox/10.0.12\r\nAccept: application/xml, text/xml, */*; q=0.01\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nAuthorization: Digest username=\"admin\", realm=\"Highwmg\", nonce=\"10782968\", uri=\"/cgi/xml_action.cgi\", response=\"63c97e126c3180f4512a9e2932d129e2\", qop=auth, nc=00000004, cnonce=\"8b2fbc2099ad78e1\"\r\nX-Requested-With: XMLHttpRequest\r\nReferer: http://192.168.21.1/\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n");

	send(s,buff,strlen(buff),0);
	printf("send open login success..\n");
	memset(buff,0,1024*20);
	recv(s,buff,1024*20,0);
	printf("recv data:%d--->\n%s",strlen(buff),buff);
	memset(buff,0,1024*20);

	free(buff);
	close(s);

	return 0;
}




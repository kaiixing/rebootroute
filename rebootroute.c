#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<sys/types.h>
#include<sys/socket.h>
#include<errno.h>
#include<netinet/in.h>
#include<arpa/inet.h>
#define SRV_PORT 80  //server port
#define SRV_IP "192.168.21.1"  //server ip

int main(int argc,char** argv)
{

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
	memset(buff,0,1024*20);

	strcpy(buff,"GET / HTTP/1.1\r\n\r\n");
	send(s,buff,strlen(buff),0);
	printf("send open index success...\n");
	memset(buff,0,1024*20);
	int markfirst=1;

	markfirst=1;
	while(recv(s,buff,1024*20,0)>0)
	{
		if(strstr(buff,"\r\n\r\n")!=NULL&&markfirst==1)  //only print http header
		{
			memset(strstr(buff,"\r\n\r\n"),0,10);
			printf("%s\n",buff);
			memset(buff,0,1024*20);
			markfirst=0;
			//break;
		}
		else
		{
					printf("recvleng :%d\n",strlen(buff));
			memset(buff,0,1024*20);
			continue;
		}
	}
	//5.login
	memset(buff,0,1024*20);
	//strcpy(buff,"GET /login.cgi?_=1510628282798 HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nX-Requested-With: XMLHttpRequest\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n");
//	strcpy(buff,"GET /login.cgi?_=1520628289768 HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0.12) Gecko/20130104 Firefox/10.0.12\r\nAccept: */*\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nExpires: -1\r\nCache-Control: no-store, no-cache, must-revalidate\r\nPragma: no-cache\r\nX-Requested-With: XMLHttpRequest\r\nReferer: http://192.168.21.1/\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n");
//strcpy(buff,"GET /login.cgi?_=1510912327128 HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0.12) Gecko/20130104 Firefox/10.0.12\r\nAccept: */*\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nExpires: -1\r\nCache-Control: no-store, no-cache, must-revalidate\r\nPragma: no-cache\r\nX-Requested-With: XMLHttpRequest\r\nReferer: http://192.168.21.1/\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n");
strcpy(buff,"GET /xml_action.cgi?method=get&module=duster&file=qs_complete HTTP/1.1\r\nHost: 192.168.21.1\r\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0.12) Gecko/20130104 Firefox/10.0.12\r\nAccept: application/xml, text/xml, */*; q=0.01\r\nAccept-Language: zh-cn,zh;q=0.5\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nAuthorization: Digest username=\"admin\", realm=\"Highwmg\", nonce=\"10782968\", uri=\"/cgi/xml_action.cgi\", response=\"63c97e126c3180f4512a9e2932d129e2\", qop=auth, nc=00000004, cnonce=\"8b2fbc2099ad78e1\"\r\nX-Requested-With: XMLHttpRequest\r\nReferer: http://192.168.21.1/\r\nCookie: locale=cn; hard_ver=Ver.A; platform=mifi\r\n\r\n");

	send(s,buff,strlen(buff),0);
	printf("send open login success..\n");
	memset(buff,0,1024*20);
	recv(s,buff,1024*20,0);
	printf("recv data:%d--->\n%s",strlen(buff),buff);
		memset(buff,0,1024*20);
	/*markfirst=1;
	while(recv(s,buff,1024*20,0)>0)
	{

		//	printf("%s\n",buff);
		//		memset(buff,0,1024*20);
		if(strstr(buff,"\r\n\r\n")!=NULL)  //only print http header
		{
			memset(strstr(buff,"\r\n\r\n"),0,10);
			printf("%s\n",buff);
			memset(buff,0,1024*20);
			markfirst=0;
		}
		else
		{
			//		printf("%s\n",buff);
			memset(buff,0,1024*20);
			continue;
		}
	}

*/

	free(buff);
	close(s);

	return 0;
}

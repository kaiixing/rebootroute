#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<openssl/md5.h>

void  bin2hex(char * buff)
{
  int i=0;
while(buff[i++]!=0)
{
  printf("%x",(int)buff[i]);
}
printf("\n");
}
int main(int argc,char ** argv)
{
	MD5_CTX mtx;
	MD5_Init(&mtx);
	char *src="admin:Highwmg:kaiixing919616";
	//char *src="GET:/cgi/protected.cgi";
	char buff[1024]={0};
MD5_Update(&mtx,(const void *)src,strlen(src));
printf("MD5_Final() return %d\n",MD5_Final(buff,&mtx));

//	MD5(src,strlen(src),buff);
int i=0;
for(i=0;i<16;i++)
{
  printf("%02d",mtx.data[i]);
}
printf("\n");
//bin2hex(buff);
//printf(buff);
	return 0;
}

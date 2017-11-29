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
    //const char *data = "hellohellowoildhellohellowoildhellohellowoildhellohellowoild";  
    const char *data = "admin:Highwmg:kaiixing919616";  
    unsigned char md[16] = {0};    
    
    MD5_CTX ctx;    
    MD5_Init(&ctx);    
    MD5_Update(&ctx, data, strlen(data));    
    MD5_Final(md, &ctx);    
        
    int i = 0;    
    char buf[33] = {0};    
    char tmp[3] = {0};    
    for(i = 0; i < 16; i++ )    
    {    
        sprintf(tmp,"%02X", md[i]);    
        strcat(buf, tmp);    
    }
    printf("%s\n",buf);
    
    return 0;    
}

#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<openssl/md5.h>

int main(int argc,char ** argv)
{
    //const char *data = "GET:/cgi/protected.cgi";  
    const char *data = "398681512012405296";  
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
        sprintf(tmp,"%02x", md[i]);    
        strcat(buf, tmp);    
    }
    printf("%s\n",buf);
    
    return 0;    
}

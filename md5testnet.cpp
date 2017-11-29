#include <iostream>
#include <fstream> 
#include <iomanip>
#include <string>
#include <openssl/md5.h>

using namespace std;

#define MAXDATABUFF 1024
#define MD5LENTH 16

int main(int arc,char *arv[])
{
    string strFilePath = arv[1];
    ifstream ifile(strFilePath.c_str(),ios::in|ios::binary);    //打开文件
    unsigned char MD5result[MD5LENTH];
    do
    {
        if (ifile.fail())   //打开失败不做文件MD5
        {
            cout<<"open file failure!so only display string MD5!"<<endl;
            break;    
        }    
        MD5_CTX md5_ctx;    
        MD5_Init(&md5_ctx);
    
        char DataBuff[MAXDATABUFF];
        while(!ifile.eof())
        {
            ifile.read(DataBuff,MAXDATABUFF);   //读文件
            int length = ifile.gcount();
            if(length)
            {
                MD5_Update(&md5_ctx,DataBuff,length);   //将当前文件块加入并更新MD5
            }
        }
        MD5_Final(MD5result,&md5_ctx);  //获取MD5
        cout<<"file MD5:"<<endl;
        for(int i = 0; i < MD5LENTH; i++)  //将MD5以16进制输出
            cout<< hex <<(int)MD5result[i];
        cout<<endl;
    }while(false); 
    
    MD5((const unsigned char*)strFilePath.c_str(),strFilePath.size(),MD5result);    //获取字符串MD5
    cout<<"string MD5:"<<endl;
    for(int i = 0; i < MD5LENTH; i++)
        cout << hex << (int)MD5result[i];
    cout<<endl;
    return 0;
}

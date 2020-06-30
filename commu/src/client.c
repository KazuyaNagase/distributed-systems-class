#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>
#include "instance.h"
#include "hexdump.h"


char* find_field_from_instance(char *field_name,struct instance *instance){
    struct object *obj = instance->object;
    struct Class *class = obj->Class;
    int field_num = class->field_num;
    for(int i=0;i < field_num; i++){
        if(!strcmp(class->field[i]->field_name,field_name)){
            return obj->str[i];
        }
    }
    return "";
}

int main(int argc, char** argv)
{
    int sd;
    struct sockaddr_in addr;

    // ソケット作成
    if((sd = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        return -1;
    }
    
    // 送信先アドレスとポート番号を設定する
    addr.sin_family = AF_INET;
    addr.sin_port = htons(2434);
    addr.sin_addr.s_addr =  inet_addr("127.0.0.1");
    connect(sd, (struct sockaddr *)&addr, sizeof(struct sockaddr_in));
    
    char str[5] = "Task";
    str[4] = '\0';
    if(send(sd, str,5, 0) < 0) {
        perror("send");
        return -1;
    }
    unsigned char buf[0x5e]; //test
    while(read(sd,buf,sizeof(buf)) <= 0);
    hexdump(buf,sizeof(buf));
    struct instance instance;
    parse_instance(buf,&instance);
    printf("\nFinish Task\n");
    char *str1 = find_field_from_instance("str1",&instance);
    char *str2 = find_field_from_instance("str2",&instance);
    printf("str1 : %s\n",str1);
    printf("str2 : %s\n",str2);
    close(sd);
    printf("終了");
    return 0;
}

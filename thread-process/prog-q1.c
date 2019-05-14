#include <stdio.h>
#include <pthread.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

int val;

void capitalize(char *str)
{
    int i;
    for (i = 0; i <= strlen(str); i++)
    {
        /* アルファベットの大文字なら変換 */
        if ((str[i] >= 'A') && (str[i] <= 'Z')){
            str[i] = str[i] + 0x20;
        }
    }

    printf("%s \n", str);
}

int main(void) { 
    pthread_t thread;
    int iret ;
    char str[] = "HELLO";
    iret = pthread_create(&thread, NULL, (void* (*)(void*))capitalize, str);
    pthread_join(thread, NULL);
    printf("end\n");
}
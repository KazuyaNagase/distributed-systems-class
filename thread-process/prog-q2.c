#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdlib.h>
#include <string.h>

int val = 0;

void capitalize(char *str)
{
    int i;
    for (i = 0; i <= strlen(str); i++)
    {
        /* アルファベットの大文字なら変換 */
        if ((str[i] >= 'A') && (str[i] <= 'Z'))
        {
            str[i] = str[i] + 0x20;
        }
    }

    printf("%s \n", str);
}

int main(void)
{
    char str[] = "HELLO";
    int status;
    int pid, wait_pid;

    pid = fork();
    if(pid == 0) {
        capitalize("child");
        exit(0);
    }

    printf("parent, child is %d\n", pid);
    capitalize("parent");

    return 0;
}

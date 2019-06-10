#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdlib.h>
#include <string.h>

char str[] = "hello\n";

void parent(int fildes[2])
{
    char str;
    // 使用しないwriteをclose
    close(fildes[1]);
    while (read(fildes[0], &str, 1) > 0)
    {
        // 子から読み取った文字を表示
        write(1, &str, 1);
    }
    // readもclose
    close(fildes[0]);
}

void child(int fildes[2])
{
    int i = 0;
    // 使用しないreadをclose
    close(fildes[0]);
    for (i = 0; i <= strlen(str); i++)
    {
        // 小文字なら大文字に変換
        if (str[i] >= 97 && str[i] <= 122)
        {
            str[i] -= 0x20;
        }
        // 送信
        write(fildes[1], &str[i], 1);
    }
    // writeもclose
    close(fildes[1]);
}

int main(void)
{
    int fildes[2];
    int pid_t, pid;
    /*
    fildes[0]: for reading
    fildes[1]: for writeing
    */

    if (pipe(fildes) == -1)
    {
        perror("pipe");
        exit(1);
    }
    if ((pid = fork()) == 0)
    {
        child(fildes);
    }
    else if (pid > 0)
    {
        parent(fildes);
    }
    else
    {
        perror("fork");
        exit(1);
    }
}
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdlib.h>
#include <string.h>

void parent(int first_fildes[2], int second_fildes[2])
{
    // 送信する文字列
    char str[] = "hello\n";
    char c;
    // 親から子には送信するので、読み取りclose
    close(first_fildes[0]);
    // 子から親に書き込みするので、書き込みclose
    close(second_fildes[1]);
    for (int i = 0; i <= strlen(str); i++)
    {
        // 親から子に送信
        write(first_fildes[1], &str[i], 1);
    }
    // 送信が終わったのでclose
    close(first_fildes[1]);

    while (read(second_fildes[0], &c, 1) > 0)
    {
        // 子から読み取った文字を表示
        write(1, &c, 1);
    }
    // 読み取りも終わったので、読み取りclose
    close(second_fildes[1]);
}

void child(int first_fildes[2], int second_fildes[2])
{
    // よろしくないが一旦静的に確保
    char str[10];
    char c;
    // 親から子には読み取りするので、書き込みclose
    close(first_fildes[1]);
    // 子から親に読み取りするので、読み取りclose
    close(second_fildes[0]);
    int i = 0;
    while (read(first_fildes[0], &c, 1) > 0)
    {
        // 親から読み取った文字を格納
        str[i++] = c;
    }
    // 読み取りが終わったので、読み込みもclose
    close(first_fildes[0]);
    for (i = 0; i <= strlen(str); i++)
    {
        // 小文字なら大文字に変換
        if (str[i] >= 97 && str[i] <= 122)
        {
            str[i] -= 0x20;
        }
        // 親に大文字にした文字を送信
        write(second_fildes[1], &str[i], 1);
    }
    // 書き込みも終わったので、書き込みもclose
    close(second_fildes[1]);
}

int main(void)
{
    // 親から子供に文字列を送信するPipe
    int first_fildes[2];
    // 子から親に文字列を送信するPipes
    int second_fildes[2];
    int pid_t, pid;
    /*
    fildes[0]: for reading
    fildes[1]: for writeing
    */

    if (pipe(first_fildes) == -1)
    {
        perror("second_pipe");
        exit(1);
    }
    if (pipe(second_fildes) == -1)
    {
        perror("second_pipe");
        exit(1);
    }

    if ((pid = fork()) == 0)
    {
        child(first_fildes, second_fildes);
    }
    else if (pid > 0)
    {
        parent(first_fildes, second_fildes);
    }
    else
    {
        perror("fork");
        exit(1);
    }
}
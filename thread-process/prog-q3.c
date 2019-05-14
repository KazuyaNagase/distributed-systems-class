#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdlib.h>
#include <string.h>

void parent(int fildes[2]) {
    char str[] = "hello\n";
    int i = 0;
    close(fildes[0]);
    for (i = 0; i <= strlen(str); i++)
    {
        write(fildes[1], &str[i], 1);
    }
    close(fildes[1]);
}

void child(int fildes[2]) {
    char c;
    close(fildes[1]);
    while(read(fildes[0], &c, 1) > 0) {
        if (c >= 97 && c <= 122) {
            c -= 0x20;
        }
        write(1, &c, 1);
    }
    close(fildes[0]);
}

int main(void) {
    int fildes[2];
    int pid_t, pid;
    /*
    fildes[0]: for reading
    fildes[1]: for writeing
    */

   if(pipe(fildes) == -1) {
       perror("pipe");
       exit(1);
   }
   if((pid = fork()) == 0) {
       child(fildes);
   } else if(pid > 0) {
       parent(fildes);
   } else {
       perror("fork");
       exit(1);
   }
}
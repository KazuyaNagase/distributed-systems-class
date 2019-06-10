
#include "hexdump.h"
void hexdump(unsigned char* byte, int size){
    int count = 0;
    for(int i = 0; i < size; i++){
        printf("%02x ",byte[i]);
        if((count+1) % 16 == 0) printf("\n");
        count++;
    }
    
}

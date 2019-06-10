
#include "person.h"
#include <string.h>
#include <stdio.h>
#include <unistd.h>
#include "instance.h"
#include <stdlib.h>

struct instance* Person(char* person_name){ //constructor
    struct instance *instance = malloc(sizeof(struct instance));
    instance->magic = 0xaced;
    instance->version = 0x0005;
    struct object *obj= instance->object = malloc(sizeof(struct object));
    obj->Class = malloc(sizeof(struct Class));
    struct Class *class = obj->Class;
    class->field_num = 1;
    class->flag = 0;
    class->name = "Person";
    class->name_len = strlen(class->name);
    class->field[0] = malloc(sizeof(struct field));
    struct field *field = class->field[0];
    field->field_name = "name";
    field->fname_len = strlen(field->field_name);
    obj->str[0] = person_name;
    return instance;
}

unsigned char* to_bytes(struct instance *instance){
    unsigned char head[1000];
    unsigned char *bytes = head;
    return head;
}









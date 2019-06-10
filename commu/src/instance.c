
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include "instance.h"


int data_num = 0;

int  parse_len(unsigned char *bytes){
    int len = (bytes[0] << 8) + bytes[1];
    return len;
}

int parse_data(unsigned char *bytes, struct object *obj){
    int ptr = 0;
    struct Class *Class = obj->Class;
    for(int i = 0; i< Class->field_num; i++){
        switch(Class->field[i]->type){
            case 'B': //byte
                obj->data[i] = malloc(sizeof(int));
                memcpy(obj->data[i],bytes,1);
                ptr++;
                break;
            case 'I': //int
                obj->data[i] = malloc(sizeof(int));
                memcpy(obj->data[i], bytes,4);
                ptr += 4;
                break;
           case 'L': //object
                ptr += parse_String(bytes + ptr, obj);
                break;
            default:
                printf("未実装");
        }
         data_num++;
    }
    return ptr;
}

int parse_prevObject(unsigned char *bytes, struct object *obj){
    int ptr = 0;
    ptr += 4; //参照
    return ptr;
}

int parse_String(unsigned char *bytes, struct object *obj){
    int ptr = 0;
    ptr++;
    int len = parse_len(bytes + ptr);
    ptr += 2; //len
    obj->str[data_num] = malloc(len);
    memcpy(obj->str[data_num],bytes + ptr ,len);
    ptr += len;
    return ptr;
}
int parse_newString(unsigned char *bytes,struct object *obj){
    int ptr = 0;
    int len = parse_len(bytes);
    ptr += 2; //len
    ptr += len;
    return ptr;
}

int parse_field(unsigned char *bytes,struct field **field_m){
    *field_m = malloc(sizeof(struct field));
    struct field *field = *field_m;
    int ptr = 0;
    field->type = bytes[ptr++];
    field->fname_len = parse_len(bytes + ptr);
    ptr += 2; //len
    field->field_name = (char *)malloc(field->fname_len);
    memcpy(field->field_name, bytes + ptr, field->fname_len);
    printf("field_name:%s",field->field_name);
    ptr += field->fname_len;
    switch(field->type){
        case 'B':
            printf("  byte型\n");
            break;
        case 'C':
        case 'D':
        case 'I':
            printf("  int型\n");
            // primitive
            break;
        case '[':
        case 'L':
            // object
            printf("  object型\n");
            ptr += parse_object(bytes + ptr, &field->object);//parse_className1 (object)
    }
    return ptr;
}


int  parse_classDesc(unsigned char *bytes,struct Class **Class_m){
    printf("\n ---Class 解析......--- \n");
    int ptr = 0;
    *Class_m = (struct Class*)malloc(sizeof(struct Class));
    struct Class *Class = *Class_m;
    Class->name_len = parse_len(bytes);
    ptr += 2;
    Class->name = (char *) malloc(Class->name_len);
    memcpy(Class->name,&bytes[ptr],Class->name_len);
    printf("Class-Name: %s\n",Class->name);
    ptr += Class->name_len;
    memcpy(Class->serial_ver_uid,&bytes[ptr],8);
    ptr += 8;
    Class->new_handle = bytes[ptr++];//とりあえず,あとでhandleの追加する.
    Class->flag = bytes[ptr++];
    Class->field_num = bytes[ptr++];
    printf("field-num = %02x\n",Class->field_num);
    for(int i = 0; i< Class->field_num; i++){
         ptr += parse_field(bytes + ptr,&Class->field[i]);
    }
    return ptr;
}

int parse_newObject(unsigned char *bytes,struct object *obj){
    int ptr = 0;
    ptr++;
    ptr += parse_classDesc( bytes + ptr, &obj->Class);
    ptr++;
    ptr++;
    ptr += parse_data(bytes + ptr, obj);
    return ptr;
}

int parse_object(unsigned char *bytes,struct object **object_m){
    *object_m = malloc(sizeof(struct object));
    struct object *obj = *object_m;
    int ptr = 0;
    ptr++; // bytes[0]文
    switch(bytes[0]){
        case TC_OBJECT:
            ptr += parse_newObject(bytes + ptr,obj);//それ自体(最初に入るやつ)
            break;
        case TC_CLASS:
            break;
        case TC_STRING:
            ptr += parse_newString(bytes + ptr,obj); // str1に入るようにハードコーディング
            break;
        case TC_REDERENCE:
            ptr += parse_prevObject(bytes + ptr, obj); //str2に入るようにハードコーディング
            break;
    }
    return ptr;
}

void test_class(struct Class **class){
    *class = malloc(sizeof(struct Class));
    struct Class *class1 = *class;
    class1->field_num = 0x10;
}

void test_obj(struct object **obj){
    *obj = malloc(sizeof(struct object));
    struct object *obj2 = *obj;
    test_class(&obj2->Class);
}

void parse_instance(unsigned char *bytes, struct instance* instance){
    int ptr = 0;
    instance->magic = parse_len(bytes);
    ptr += 2;
    instance->version = parse_len(bytes + ptr);
    ptr += 2;
    parse_object(bytes + ptr,&instance->object);
}






#ifndef instance_h
#define instance_h

#include <stdio.h>

#define STREAM_MAGIC 0xaced
#define STREAM_VERSION 5
#define TC_NULL 0x70
#define TC_REDERENCE 0x71
#define TC_CLASSDESC 0x72
#define TC_OBJECT 0x73
#define TC_STRING 0x74
#define TC_ARRAY 0x75
#define TC_CLASS 0x76
#define TC_BLOCKDATA 0x78
#define TC_ENDBLOCKDATA 0x78
#define TC_RESET 0x79
#define TC_BLOCKDATALONG 0x7a
#define TC_EXCEPTION 0x7b
#define TC_LONGSTRING 0x7c
#define TC_PROXYCLASSDESC 0x7d
#define TC_ENUM 0x7e
#define baseWireHandle 0x7E0000

#define SC_WRITE_METHOD 0x01
#define SC_BLOCK_DATA 0x08
#define SC_SERIALIZABLE 0x02
#define SC_EXTERNALIZABLE 0x04
#define SC_ENUM 0x10
struct Class;
struct data;
struct object;
struct field;
struct instance;

extern int data_num;

int parse_String(unsigned char *bytes, struct object *obj);
void parse_instance(unsigned char *bytes, struct instance* instance);
int parse_data(unsigned char *bytes, struct object *obj);
int parse_prevObject(unsigned char *bytes, struct object *obj);
int parse_newString(unsigned char *bytes,struct object *obj);
int parse_field(unsigned char *bytes,struct field **field);
int parse_classDesc(unsigned char *bytes, struct Class **class);
int parse_newObject(unsigned char *bytes,struct object *obj);
int parse_object(unsigned char *bytes,struct object **obj);



struct Class{
    short name_len;
    char *name;
    unsigned char serial_ver_uid[8];
    unsigned char new_handle;
    unsigned char flag;
    unsigned char field_num;
    struct field *field[0xff]; //フィールド数最大(1byteなのでこれで良い？もう色々面倒すぎてやばい...)
};

struct data{
    union {
        unsigned char b;
        int i;
        struct object *object;
    };
};

struct object{
    struct Class *Class;
    union{
        struct data *data[0xff]; //primitive
        char *str[0xff];
    };
};

struct field{
    char type;
    short fname_len;
    char *field_name;// sizeはname_len
    struct field *field;
    struct object *object;
};

struct instance {
    unsigned short magic;
    unsigned short version;
    struct object *object;
};


#endif /* instance_h */

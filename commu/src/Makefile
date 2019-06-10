
SERVER = Server.java Task.java Util.java RemoteObjectManager.java
CLIENT = person.c hexdump.c instance.c client.c 


server: $(SERVER)
	javac $(SERVER)

client: $(CLIENT)
	gcc $(CLIENT) -o client

runsrv: 
	java Server 

runclt:
	./client


clean:
	rm -rf *.class ./client 

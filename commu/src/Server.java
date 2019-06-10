import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {
    public static void main(String args[]) {
        RemoteObjectManager rom = new RemoteObjectManager();
        // Task Calss 作る
        rom.register("Task",new Task());
        try {
            ServerSocket server = new ServerSocket(2434);
            while(true){
                System.out.println("Server waiting...");
                Socket client = server.accept();

                InputStream is = client.getInputStream();
                int i;
                String str = "";
                while((i = is.read()) !='\0'){
                    str += (char)i;
                }
                OutputStream os = client.getOutputStream();
                Object obj = rom.search(str);
                System.out.println("write:");
                byte[] objBytes = Util.serialize(obj);
                System.out.println(Util.hexDump(objBytes));
                os.write(objBytes);

                client.close();
            }
        } catch (Exception e) {
            System.err.println("Server exception: " + e.toString());
            e.printStackTrace();
        }
    }
}

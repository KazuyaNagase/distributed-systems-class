import java.io.*;
import java.util.Objects;

public class Util {
    public static byte[] serialize(Object obj){
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try {
            ObjectOutputStream oos = new ObjectOutputStream(bos);
            oos.writeObject(obj);
            return bos.toByteArray();
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public static Object deserialize(byte[] bytes){
        Objects.requireNonNull(bytes);
        ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
        try {
            ObjectInputStream ois = new ObjectInputStream(bis);
            return ois.readObject();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String hexDump(byte[] bytes){
        Objects.requireNonNull(bytes);
        StringBuilder result = new StringBuilder();
        int count = 0;
        for(byte b : bytes){
            result.append(String.format("%02x ", b));
            if((count + 1)% 16 == 0){
                result.append("\n");
            }
            count ++;

        }
        return result.toString();
    }

    private Util(){}
}

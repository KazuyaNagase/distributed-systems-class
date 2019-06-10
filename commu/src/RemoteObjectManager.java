import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.util.HashMap;
import java.lang.reflect.Method;

public class RemoteObjectManager{
    private HashMap<String,Object> tasks = new HashMap<>();

    public void register(String name, Object obj){
        tasks.put(name,obj);
    }

    public Object search(String key){
        return tasks.get(key);
    }

    public void execute(String taskName, String methodName, Object arg){
        try {
            Class<?> c = Class.forName(taskName);
            Method m = c.getMethod(methodName,Object.class);
            m.invoke(search(taskName), arg);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


}

import java.io.Serializable;
public class Task implements Serializable {
    private static final long serialVersionUID = 0x8877665544332211L;
    public int v = 0x12345678;
    public String str1 = "Hello"; // str1+str2 = 10 Only
    public String str2 = "World";
    public byte x = 1;
    public void hello(Person p) { System.out. println(p.name);
    }
}
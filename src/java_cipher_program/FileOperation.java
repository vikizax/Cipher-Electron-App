import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class FileOperation {
    private File file;

    public boolean createFile(String fileName, String filePath) throws IOException {
        file = new File(filePath + File.separator + fileName);
        file.getParentFile().mkdirs();
        if (file.createNewFile()) {
            file = null;
            return true;
        } else {
            file = null;
            return false;
        }
    }

    public String read(String fileName, String filePath) throws IOException {
        String readResult = "";

        FileReader fr = new FileReader(filePath + File.separator + fileName);
        int ascii;
        while ((ascii = fr.read()) != -1) {
            readResult += ((char) ascii);
        }
        fr.close();

        return readResult;
    }

    public void write(String fileName, String filePath, String fileContent) throws IOException {

        FileWriter fw = new FileWriter(filePath + File.separator + fileName);
        fw.write(fileContent);
        fw.close();
        file = null;
    }

}
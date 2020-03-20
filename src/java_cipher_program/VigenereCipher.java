
/**
 * Vigenere cipher operation
 * three inputs to provide as command line argument
 * input mode: (option, key, message) || file mode: (option, key, inputFileName, outputFileName, directoryPathForTheSelectedFile)
 * option : "1" - for encryption, "2" - for decryption, "3"- encryption using file, "4" - decryption using file
 * key : key to be used
 * message: either cipher text or plain text depending on option provided
 * inputFileName : Name of the file from which plan text will be read
 * outputFileName : Name of the file in which cipher text will be saved 
 * directoryPathForTheSelectedFile: path of inputFileName, outputFile will be saved in the same directory
 * 
 * @NOTE: class file should be kept in ./src/cipher_java_class and ./extraResources
 */

import com.sun.management.OperatingSystemMXBean;

import java.io.IOException;
import java.lang.management.ManagementFactory;

public class VigenereCipher {

    private static final double MEGABYTE = 1024 * 1024;

    public static double bytesToMegabytes(long bytes) {
        return (double) (bytes / MEGABYTE);
    }

    public static void main(String[] args) throws IOException {
        long startTime = System.nanoTime();
        FileOperation file = new FileOperation();
        OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);
        String message = "";
        String inputFileName = "";
        String dir = "";
        String outputFileName = "";

        try {
            if (args.length == 5) {
                // take input file name
                inputFileName = args[2].trim();
                // take output file name
                outputFileName = args[3].trim();
                // take dir of the given file
                dir = args[4].trim();
                // message read from file
                message = file.read(inputFileName, dir).replaceAll("\\s+", "").toUpperCase();

            } else {
                message = args[2].replaceAll("\\s+", "").toUpperCase();
            }

            String option = args[0];

            String keyWord = args[1].replaceAll("\\s+", "").toUpperCase();

            String result = "";

            if (keyWord.length() > message.length()) {
                System.out.println(
                        "Err: Plain Text length must be equal to or greater than Key length (blank space is not counted)");
                System.exit(0);
            }

            // check if keyword or plain text contains numerics or special characters
            if (message.matches("^[a-zA-Z]*$") == false || keyWord.matches("^[a-zA-Z]*$") == false) {
                System.out.println("Err: Plain Text or Key must contain only alphabets");
                System.exit(0);
            }

            /**
             * Vigenre Cipher Operation
             */

            String key = "";
            // make key equal to the size of plain text
            // (only when plain text length > keyword length)
            if (message.length() > keyWord.length()) {
                key = generateKey(keyWord, message.length());
            } else {
                key = keyWord;
            }

            switch (option) {
                case "1":
                    result = encrypt(key, message);
                    break;
                case "2":
                    result = decrypt(key, message);
                    break;

                case "3":
                    result = encrypt(key, message);
                    fileAdd(file, outputFileName, dir, result);
                    break;
                case "4":
                    result = decrypt(key, message);
                    fileAdd(file, outputFileName, dir, result);
                    break;

                default:
                    System.out.println("Err: Invalid Option");
            }

            file = null;
            // Get the Java runtime
            Runtime runtime = Runtime.getRuntime();
            // Run the garbage collector
            runtime.gc();
            // Calculate the used memory
            long memory = runtime.totalMemory() - runtime.freeMemory();

            // get cpu usage time
            double cpuTime = (double) osBean.getProcessCpuTime() / 1_000_000_000.0;
            cpuTime = cpuTime < 0 ? 0 : cpuTime;

            long endTime = System.nanoTime();
            double totalElapsedTime = (double) ((endTime - startTime) / 1_000_000_000.0);
            System.out.println(
                    "Res: " + totalElapsedTime + " " + bytesToMegabytes(memory) + " " + cpuTime + " " + result);

        } catch (IOException e) {
            System.out.println("Err: " + e.getMessage());
        }
    }

    // create and add changes to file
    public static void fileAdd(FileOperation file, String outputFileName, String dir, String result) {
        try {
            if (file.createFile(outputFileName, dir)) {
                file.write(outputFileName, dir, result);
            } else {
                file.write(outputFileName, dir, result);
            }
        } catch (IOException e) {
            System.out.println("Err: " + e.getMessage());
        }
    }

    // makes key length equal to plain text length
    public static String generateKey(String keyWord, int plainTextLength) {
        String finalKeyword = keyWord;
        int alphaIter = 0;
        while (finalKeyword.length() != plainTextLength) {
            if (alphaIter == keyWord.length() - 1)
                alphaIter = 0;

            finalKeyword += keyWord.charAt(alphaIter);
            alphaIter += 1;
        }

        return finalKeyword;
    }

    // vigenere encryption
    public static String encrypt(String key, String plainText) {
        String cipher = "";

        for (int i = 0; i < plainText.length(); ++i) {
            cipher += (char) ((key.charAt(i) + plainText.charAt(i)) % 26 + 65);
        }

        return cipher;
    }

    // vigenere decryption
    public static String decrypt(String key, String cipherText) {
        String message = "";

        for (int i = 0; i < cipherText.length(); ++i) {
            message += ((cipherText.charAt(i) - key.charAt(i))) < 0
                    ? (char) (((cipherText.charAt(i) - key.charAt(i)) + 26) + 65)
                    : (char) (((cipherText.charAt(i) - key.charAt(i))) + 65);
        }

        return message;
    }

}
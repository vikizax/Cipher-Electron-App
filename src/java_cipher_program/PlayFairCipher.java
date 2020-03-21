/**
 * Play fair cipher operation
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

public class PlayFairCipher {
    private final double MEGABYTE = 1024 * 1024;

    public double bytesToMegabytes(long bytes) {
        return (double) (bytes / MEGABYTE);
    }

    public void init(String[] args) {
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

            StringBuffer inputKeyword = new StringBuffer(args[1]).reverse();
            String keyword = inputKeyword.toString().replaceAll("(.)(?=.*\\1)", "");
            inputKeyword = new StringBuffer(keyword).reverse();
            keyword = inputKeyword.toString().replaceAll("\\s+", "").toUpperCase();

            String result = "";

            // check if keyword or plain text contains numerics or special characters
            if (message.matches("^[a-zA-Z]*$") == false || keyword.matches("^[a-zA-Z]*$") == false) {
                System.out.println("Err: Plain Text or Key must contain only alphabets");
                System.exit(0);
            }
            /**
             * Play fair Cipher
             * 
             * 5 x 5 matrix is created using the keyword keyword is filtered to remove the
             * duplicate alphate 5 x 5 matrix is filled with keyword and the remaining
             * alphabet A-Z uniquely
             * 
             */

            // fill in the key matrix
            char keyMat[][] = generateKeyMatrix(keyword);

            switch (option) {

                case "1":
                    // ENCRYPTION
                    // RULES:
                    // 1: If in row: take immidiate right
                    // 2: If in column: take immidiate down
                    // 3: If forms rectangle/square: take the opposite corner in a same row

                    result = encrypt(keyMat, message);
                    break;
                case "2":
                    // DECRYPTION
                    // RULES :
                    // 1: If in row: take immidiate left
                    // 2: If in column: take immidiate up
                    // 3: If forms rectangle/square: take the opposite corner in a same row

                    result = decrypt(keyMat, message);
                    break;

                case "3":
                    result = encrypt(keyMat, message);
                    fileAdd(file, outputFileName, dir, result);
                    break;
                case "4":
                    result = decrypt(keyMat, message);
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

            System.out.println("Res: " +totalElapsedTime + " " + bytesToMegabytes(memory) + " " + cpuTime + " " + result);
        } catch (IOException e) {
            System.out.println("Err: " + e.getMessage());
            System.exit(0);
        }
    }

    // create and add changes to file
    public void fileAdd(FileOperation file, String outputFileName, String dir, String result) {
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

    // return unique character excluding from keyword
    public char alphabetLoop(char current, String keyword) {
        char resultChar = '\0';

        for (int i = (current % 65); i <= 26; ++i) {
            if (keyword.indexOf("" + ((char) (i + 65))) == -1 && (char) (i + 65) != 'J') {
                resultChar = (char) (i + 65);
                break;
            }
        }

        return resultChar;
    }

    // generates key matrix
    public char[][] generateKeyMatrix(String keyword) {
        char keyMat[][] = new char[5][5];
        boolean keyFilledInMatrix = false;
        // int contRow = 0, contCol = 0;
        char currentAlpha = 'A';
        int cursor = 0;
        // fill the keyword
        for (int i = 0; i < 5; ++i) {
            for (int j = 0; j < 5; ++j) {
                if (cursor < keyword.length() && keyFilledInMatrix == false) {
                    keyMat[i][j] = keyword.charAt(cursor);
                    cursor += 1;
                }
                if (cursor == keyword.length() && keyFilledInMatrix == false) {
                    keyFilledInMatrix = true;
                    continue;
                }

                if (keyFilledInMatrix) {
                    currentAlpha = alphabetLoop(currentAlpha, keyword);
                    keyMat[i][j] = currentAlpha;
                    keyword += currentAlpha;
                }
            }
        }

        return keyMat;
    }

    // find the position of the given character in the key matrix
    public String findCharInKeyMat(char toFind, char[][] keyMat) {
        toFind = toFind == 'J' ? 'I' : toFind;
        for (int i = 0; i < 5; ++i)
            for (int j = 0; j < 5; ++j)
                if (keyMat[i][j] == toFind)
                    return (i + "" + j);
        return null;
    }

    // Play fair Cipher Encryption
    public String encrypt(char[][] keyMat, String plainText) {

        String encryptedText = "";

        // check if the lenght of the plain text is even, if not add 'X' to make it even
        if (plainText.length() % 2 != 0) {
            plainText += "X";
        }

        // iterate plain text to get the pair
        int iterPlain = 0;
        while (iterPlain < plainText.length()) {

            // get the position of the pair
            String posX = findCharInKeyMat(plainText.charAt(iterPlain), keyMat);
            String posY = findCharInKeyMat(plainText.charAt(iterPlain + 1), keyMat);

            int rowPosX, colPosX, rowPosY, colPosY;

            // play fair condition check

            if (posX == null || posY == null) {
                encryptedText += plainText.charAt(iterPlain) + "" + plainText.charAt(iterPlain + 1);
                iterPlain += 2;

                continue;
            }

            // same row condition :
            else if (posX.charAt(0) == posY.charAt(0)) {

                rowPosX = Character.getNumericValue(posX.charAt(0));
                colPosX = (Character.getNumericValue(posX.charAt(1)) + 1) % 5;

                rowPosY = Character.getNumericValue(posY.charAt(0));
                colPosY = (Character.getNumericValue(posY.charAt(1)) + 1) % 5;
            }
            // same column condition
            else if (posX.charAt(1) == posY.charAt(1)) {

                rowPosX = (Character.getNumericValue(posX.charAt(0)) + 1) % 5;
                // rowPosX = rowPosX < 0 ? rowPosX + 5 : rowPosX;
                colPosX = Character.getNumericValue(posX.charAt(1));

                rowPosY = (Character.getNumericValue(posY.charAt(0)) + 1) % 5;
                // rowPosY = rowPosY < 0 ? rowPosY + 5 : rowPosY;
                colPosY = Character.getNumericValue(posY.charAt(1));

            }
            // not is same row and neither in same column condition:
            else {
                rowPosX = Character.getNumericValue(posX.charAt(0));
                colPosX = Character.getNumericValue(posY.charAt(1));

                rowPosY = Character.getNumericValue(posY.charAt(0));
                colPosY = Character.getNumericValue(posX.charAt(1));

            }
            encryptedText += keyMat[rowPosX][colPosX] + "" + keyMat[rowPosY][colPosY];
            iterPlain += 2;

        }

        return encryptedText;
    }

    // Play fair Cipher Decryption
    public String decrypt(char[][] keyMat, String cipherText) {

        String plainText = "";

        // check if the lenght of the plain text is even, if not add 'X' to make it even
        if (cipherText.length() % 2 != 0) {
            cipherText += "X";
        }

        // iterate plain text to get the pair
        int iterPlain = 0;
        while (iterPlain < cipherText.length()) {

            // get the position of the pair
            String posX = findCharInKeyMat(cipherText.charAt(iterPlain), keyMat);
            String posY = findCharInKeyMat(cipherText.charAt(iterPlain + 1), keyMat);

            int rowPosX, colPosX, rowPosY, colPosY;

            // play fair condition check
            if (posX == null || posY == null) {
                plainText += cipherText.charAt(iterPlain) + "" + cipherText.charAt(iterPlain + 1);
                iterPlain += 2;

                continue;
            }
            // same row condition :
            else if (posX.charAt(0) == posY.charAt(0)) {

                rowPosX = Character.getNumericValue(posX.charAt(0));
                colPosX = (Character.getNumericValue(posX.charAt(1)) - 1) % 5;
                colPosX = colPosX < 0 ? colPosX + 5 : colPosX;
                rowPosY = Character.getNumericValue(posY.charAt(0));
                colPosY = (Character.getNumericValue(posY.charAt(1)) - 1) % 5;
                colPosY = colPosY < 0 ? colPosY + 5 : colPosY;
            }
            // same column condition
            else if (posX.charAt(1) == posY.charAt(1)) {

                rowPosX = (Character.getNumericValue(posX.charAt(0)) - 1) % 5;
                rowPosX = rowPosX < 0 ? rowPosX + 5 : rowPosX;
                colPosX = Character.getNumericValue(posX.charAt(1));

                rowPosY = (Character.getNumericValue(posY.charAt(0)) - 1) % 5;
                rowPosY = rowPosY < 0 ? rowPosY + 5 : rowPosY;
                colPosY = Character.getNumericValue(posY.charAt(1));

            }
            // not is same row and neither in same column condition:
            else {
                rowPosX = Character.getNumericValue(posX.charAt(0));
                colPosX = Character.getNumericValue(posY.charAt(1));

                rowPosY = Character.getNumericValue(posY.charAt(0));
                colPosY = Character.getNumericValue(posX.charAt(1));

            }
            plainText += keyMat[rowPosX][colPosX] + "" + keyMat[rowPosY][colPosY];
            iterPlain += 2;

        }

        return plainText;
    }

}
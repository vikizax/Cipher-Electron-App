/**
 * Hill cipher
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
import java.lang.String;
import java.lang.management.ManagementFactory;
import java.math.*;

public class HillCipher {
    private static final double MEGABYTE = 1024 * 1024;

    public static double bytesToMegabytes(long bytes) {
        return (double) (bytes / MEGABYTE);
    }

    public static void main(String[] args) {
        // start time
        long startTime = System.nanoTime();
        String result = "";

        OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);

        String option = "";
        String key = "";
        String message = "";
        String inputFileName = "";
        String dir = "";
        String outputFileName = "";
        double determinant = 0;
        BigInteger det = null;
        BigInteger mod = null;
        BigInteger invDet = null;
        try {
            FileOperation file = new FileOperation();
            if (args.length == 5) {
                // take input file name
                inputFileName = args[2].trim();
                // take output file name
                outputFileName = args[3].trim();
                // take dir of the given file
                dir = args[4].trim();
                // message read from file
                message = file.read(inputFileName, dir).replaceAll("\\s+", "");

            } else {
                // take in plain message and remove all white space from it
                message = args[2].replaceAll("\\s+", "");
            }

            option = args[0];
            // take in key and1 remove all white space from it
            key = args[1].replaceAll("\\s+", "");

            // check if key or plain text contains numerics or special characters
            if (message.matches("^[a-zA-Z]*$") == false || key.matches("^[a-zA-Z]*$") == false) {
                System.out.println("Err: Plain Text or Key must contain only alphabets");
                System.exit(0);
            }

            /**
             * for matrix n x n length of the key must be perfext sqr root for eg: if length
             * is 4 -> sqr root will be 2, so n = 2 -> 2 x 2 matrix
             * 
             * if lenght is not perfect sqr root, then program will exit for eg: if length
             * is 3 or 5 or any -> sqr root is in fraction, so n x n is not possible
             */

            // Determining the Matrix size from the key given
            int keyLen = key.length();

            // matrix n value | length
            int keyMatLen = (int) Math.sqrt(keyLen);

            // message length
            int messageLen = message.length();

            if (messageLen < keyLen) {
                System.out.println(
                        "Err: Message length should be equal to or greater then Key length (blank space is not counted)");
                System.exit(0);
            }

            // n x n feasibility check
            if (keyLen != keyMatLen * keyMatLen) {
                System.out.println("Err: n x n is not possible, please increase/decrease the key length");
                System.exit(0);
            }

            // generating Key Matrix
            // used to iterate message char
            int charPos = 0;
            // stores key matrix converted to alphabet position from 0 - 25
            double[][] keyMat = new double[keyMatLen][keyMatLen];
            for (int i = 0; i < keyMatLen; i++) {
                for (int j = 0; j < keyMatLen; j++) {
                    keyMat[i][j] = Character.toUpperCase(key.charAt(charPos)) % 65;
                    charPos++;
                }
            }
            // determing the size of array to store all the message matrix as a 1d array
            // eg: [ [1,2,3], [4,5,6], ... ] -> [1,2,3,4,5,6, ....]
            // size of the message 1d array
            int completeMessageMatLen = keyMatLen;
            /**
             * if message length is perfectly divisible then 1d array size = length of the
             * message for eg: message is "hell" -> length = 4 so 4 % keyMatLen ,i.e, 4 % 2
             * = 0 so message "hell" -> [h,e] [l,l] -> [h, e, l, l], here 4 is the size
             * 
             * lets take anohter example where message lenght is not perfectly divisible my
             * keyMatLen so message is "hello", keyMatLen suppose is 2 then for key matrix
             * is 2 x 2, so message matrix -> (2 x 1) -> [h,e] [l,l] [o, a], here 'a' is
             * taken to fill in the blank space to fill the matrix if converted to 1d ->
             * [h,e,l,l,o,a] -> length = 6 ->(int) ((5/2) + 1) * 2 = 6 which is ((messsage
             * lenght / keyMatLen) + 1) * keyMatLen
             */
            if (messageLen % keyMatLen == 0)
                completeMessageMatLen = messageLen;
            else
                completeMessageMatLen = ((messageLen / keyMatLen) + 1) * keyMatLen;

            // 1d array to store the message char converted to position value from 0 - 26
            int completeMessageMat[] = new int[completeMessageMatLen];

            // generating message matrix n x 1

            // used to iterate message characters
            int messageIter = 0;
            for (int j = 0; j < completeMessageMatLen; j++) {
                // replace the empty place with 'A' = 1
                if (messageIter >= messageLen) {
                    completeMessageMat[j] = 1;
                } else {
                    completeMessageMat[j] = Character.toUpperCase(message.charAt(messageIter)) % 65;
                }
                messageIter++;
            }

            switch (option) {
                case "1":
                    /**
                     * encryption process (key matrix x message matrix) % 26 = cipher text
                     */

                    result = HillOperation(completeMessageMatLen, completeMessageMat, keyMatLen, keyMat);

                    break;
                case "2":
                    /**
                     * Decryption process First check key's determinant if det = non zero then
                     * cipher generated from the key is inversable in modulo 26 else only encryption
                     * will be possible not decrytion
                     */

                    determinant = determinant(keyMat, keyMatLen);

                    if (determinant == 0) {
                        System.out.println("Err: Cannot Proceed, not invertible key.");
                        System.exit(0);
                    }

                    det = new BigInteger("" + (int) determinant);
                    mod = new BigInteger("26");
                    // multiplicative inverse of determinant
                    invDet = det.modInverse(mod);
                    double keyInverse[][] = invert(keyMat);

                    // inverse in modulo 26
                    keyInverse = inverseKeyMatMod(keyMatLen, keyInverse, determinant, invDet);

                    result = HillOperation(completeMessageMatLen, completeMessageMat, keyMatLen, keyInverse);

                    break;

                case "3":
                    // encrypt data from a file
                    result = HillOperation(completeMessageMatLen, completeMessageMat, keyMatLen, keyMat);

                    fileAdd(file, outputFileName, dir, result);

                    break;

                case "4":

                    determinant = determinant(keyMat, keyMatLen);

                    if (determinant == 0) {
                        System.out.println("Err: Cannot Proceed, not invertible key.");
                        System.exit(0);
                    }

                    det = new BigInteger("" + (int) determinant);
                    mod = new BigInteger("26");
                    // multiplicative inverse of determinant
                    invDet = det.modInverse(mod);
                    double keyInv[][] = invert(keyMat);

                    // inverse in modulo 26
                    keyInverse = inverseKeyMatMod(keyMatLen, keyInv, determinant, invDet);

                    result = HillOperation(completeMessageMatLen, completeMessageMat, keyMatLen, keyInverse);

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

            // end time
            long endTime = System.nanoTime();
            // total execution time
            double totalElapsedTime = (double) ((endTime - startTime) / 1_000_000_000.0);

            System.out.println("Res: " +totalElapsedTime + " " + bytesToMegabytes(memory) + " " + cpuTime + " " + result);
        } catch (ArithmeticException e) {
            System.out.println("Err: Multiplicative inverse is not possible for the key. Please choose another key.");
            System.exit(0);
        } catch (IOException e) {
            System.out.println("Err: " + e.getMessage());
            System.exit(0);
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

    // inverse key mat in mod 26
    public static double[][] inverseKeyMatMod(int keyMatLen, double keyInverse[][], double determinant,
            BigInteger invDet) {
        // inverse in modulo 26
        for (int i = 0; i < keyMatLen; ++i) {
            for (int j = 0; j < keyMatLen; ++j) {
                keyInverse[i][j] = (int) (keyInverse[i][j] * determinant * invDet.intValue() % 26);
                if (keyInverse[i][j] < 0)
                    keyInverse[i][j] = keyInverse[i][j] + 26;
            }
        }
        return keyInverse;
    }

    // Encrypt or Decrypt a message
    public static String HillOperation(int completeMessageMatLen, int completeMessageMat[], int keyMatLen,
            double keyMatOrInverse[][]) {

        // 1d array to store the encrypted/decrypted value of the message
        int[] hillEncDecMessage = new int[completeMessageMatLen];
        hillEncDecMessage[0] = 0;

        // key matrix row iterator
        int row = 0;
        // key matrix column iterator
        int column = 0;
        // encrypted 1d array position iterator
        int enDecryIter = 0;
        // loop the entire message
        for (int i = 0, j = 0; j < completeMessageMatLen; i += keyMatLen, j++) {
            // this will give message in the n mat pattern
            // [h,e] [l,l] [o, a]
            while (true) {
                hillEncDecMessage[enDecryIter] += keyMatOrInverse[row][column] * completeMessageMat[i + column];

                // when for n x n matrix where n reaches the max value, then break from while
                // loop
                if (row == keyMatLen - 1 && column == keyMatLen - 1) {
                    // keep the mod value of the last n
                    hillEncDecMessage[enDecryIter] = hillEncDecMessage[enDecryIter] % 26;
                    // increament encrypt array position
                    enDecryIter++;
                    // reset row
                    row = 0;
                    // reset column
                    column = 0;
                    break;
                }

                if (column == keyMatLen - 1) {
                    // keep the mod value of the first n
                    hillEncDecMessage[enDecryIter] = hillEncDecMessage[enDecryIter] % 26;
                    // change row
                    row++;
                    // increament encrypt array position
                    enDecryIter++;
                    // reset column
                    column = 0;
                    continue;
                }

                column++;
            }
            // stop when all the postion of the array is filled
            if (enDecryIter == completeMessageMatLen)
                break;
        }

        String cipherTextOrPlainMessage = "";
        for (int i = 0; i < completeMessageMatLen; i++) {
            cipherTextOrPlainMessage += (char) (hillEncDecMessage[i] + 65);
        }

        return cipherTextOrPlainMessage;
    }

    // get the determinante of the given n x n matrix
    public static double determinant(double keyMat[][], int keyMatLen) {
        double det = 0, sign = 1;
        int p = 0, q = 0;

        if (keyMatLen == 1) {
            det = keyMat[0][0];
        } else {
            double b[][] = new double[keyMatLen - 1][keyMatLen - 1];
            for (int x = 0; x < keyMatLen; x++) {
                p = 0;
                q = 0;
                for (int i = 1; i < keyMatLen; i++) {
                    for (int j = 0; j < keyMatLen; j++) {
                        if (j != x) {
                            b[p][q++] = keyMat[i][j];
                            if (q % (keyMatLen - 1) == 0) {
                                p++;
                                q = 0;
                            }
                        }
                    }
                }
                det = det + keyMat[0][x] * determinant(b, keyMatLen - 1) * sign;
                sign = -sign;
            }
        }
        return det;
    }

    // inverse the matrix using row operation
    public static double[][] invert(double a[][]) {
        int n = a.length;
        double x[][] = new double[n][n];
        double b[][] = new double[n][n];
        int index[] = new int[n];
        for (int i = 0; i < n; ++i)
            b[i][i] = 1;

        // Transform the matrix into an upper triangle
        gaussian(a, index);

        // Update the matrix b[i][j] with the ratios stored
        for (int i = 0; i < n - 1; ++i)
            for (int j = i + 1; j < n; ++j)
                for (int k = 0; k < n; ++k)
                    b[index[j]][k] -= a[index[j]][i] * b[index[i]][k];

        // Perform backward substitutions
        for (int i = 0; i < n; ++i) {
            x[n - 1][i] = b[index[n - 1]][i] / a[index[n - 1]][n - 1];
            for (int j = n - 2; j >= 0; --j) {
                x[j][i] = b[index[j]][i];
                for (int k = j + 1; k < n; ++k) {
                    x[j][i] -= a[index[j]][k] * x[k][i];
                }
                x[j][i] /= a[index[j]][j];
            }
        }
        return x;
    }

    // carry out the partial-pivoting gaussian elimination
    public static void gaussian(double a[][], int index[]) {
        // index[] stores pivoting order.
        int n = index.length;
        double c[] = new double[n];

        // Initialize the index
        for (int i = 0; i < n; ++i)
            index[i] = i;

        // Find the rescaling factors, one from each row
        for (int i = 0; i < n; ++i) {
            double c1 = 0;
            for (int j = 0; j < n; ++j) {
                double c0 = Math.abs(a[i][j]);
                if (c0 > c1)
                    c1 = c0;
            }
            c[i] = c1;
        }

        // Search the pivoting element from each column
        int k = 0;
        for (int j = 0; j < n - 1; ++j) {
            double pi1 = 0;
            for (int i = j; i < n; ++i) {
                double pi0 = Math.abs(a[index[i]][j]);
                pi0 /= c[index[i]];
                if (pi0 > pi1) {
                    pi1 = pi0;
                    k = i;
                }
            }

            // Interchange rows according to the pivoting order
            int itmp = index[j];
            index[j] = index[k];
            index[k] = itmp;
            for (int i = j + 1; i < n; ++i) {
                double pj = a[index[i]][j] / a[index[j]][j];

                // Record pivoting ratios below the diagonal
                a[index[i]][j] = pj;

                // Modify other elements accordingly
                for (int l = j + 1; l < n; ++l)
                    a[index[i]][l] -= pj * a[index[j]][l];
            }
        }
    }
}

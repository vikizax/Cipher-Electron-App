public class CipherMain {
    public static void main(String[] args) {
        String cipherCall = args[0];
        String[] arg = new String[args.length - 1];
        for (int i = 0; i < args.length - 1; ++i) {
            arg[i] = args[i + 1];
        }
        switch (cipherCall) {
            case "HillCipher":
                new HillCipher().init(arg);
                break;
            case "PlayFairCipher":
                new PlayFairCipher().init(arg);
                break;
            case "VigenereCipher":
                new VigenereCipher().init(arg);
                break;
            case "VernamCipher":
                new VernamCipher().init(arg);
                break;
        }
    }
}
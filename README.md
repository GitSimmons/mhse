### WARNING: This tool will no longer work as of Iceborne release, the save file has been encrypted in a different way

# Monster Hunter World Save Decryptor

A node script for decrypting classic MHW saves and extracting appearance data and equipment info from save files into JSON. The goal of the tool was to make it easy to quickly share and change appearances using javascript. Because it's written in JS, it can be easily ported to work in browser, allowing players to 'upload' their save file to a site, have it be decrypted in browser, and then send the json to a server for storage. Unfortunately, the appearance sharing site was still in progress when the encryption changed. If you need a dummy save file to test this tool out, feel free to contact me! Though you can likely find one elsewhere.

## Usage

The yargs are pretty clear so we'll just copy those here, preface each of the following commands with node mhse.js

`decrypt [source] [output]` : Decrypt a save file

`encrypt [source] [output]` : Encrypt a decrypted save file

`getJSON [source]` : Read decrypted save file and create JSON files for each character

## Acknowledgements

While I suspect that this is the only JS solution for this problem: I am not an expert at decryption by any means and the logic for this project is entirely based off of the MHW Modding Discord's prior work in C#, available at https://github.com/AsteriskAmpersand/MHW-Save-Editor

Here is the credits they cite:
nexusphobiker - For figuring out the encryption function location in memory and having the first decrypter.
legendff and Count Lizzie - For figuring out the encryption algorithm and the checksum.
legendff - For getting all of the encryption keys from memory.
Pascal/Ambytes - For writing the C# decryptor and checksum.
AsteriskAmpersand - For rewriting the base GUI to support a complete editor, doing the save file investigation structure and investigation editor portion.
Kaito - For helping testing and debugging the investigation editor and the new GUI. Also responsible for the backup and restore functionality.
goose - For the appearance struct.
V00d00y - For almost every other structure in the save files not found by the previously listed.
V00d00y and Stratas - For robustness testing and the second for help with profiling performances.
Seikur0 - For his tables which allowed V00d00y to do the above listed.
W.EzeithLis - For his help with Investigation Box Rewards calculations.
Digifreak and W.EzeithLis - For their help with zenny bonus calculations and tabulating.
The investigation editor testers: AllStarTech, Kaito, nicemoreoften, Syelia Walldasher, W.EzeithLis, Digifreak, V00d00y, Stratas.
The saves fallen in battle: nicemoreoften and Saddah.

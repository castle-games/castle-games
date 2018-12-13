This is needed to fix "/usr/lib64/libstdc++.so.6: version `CXXABI_1.3.8' not found" error on GameLift machines. This started happening when I added the main AWS SDK.

Here is a stack overflow answer about this:
https://stackoverflow.com/questions/46172600/usr-lib64-libstdc-so-6-version-cxxabi-1-3-8-not-found

To generate these files, I started a t2.xlarge EC2 instance. Use rsync or scp to get gcc-7.3.0.tar.xz onto the machine. Then add 16G of swap using these instructions:
https://stackoverflow.com/questions/17173972/how-do-you-add-swap-to-an-ec2-instance

Compile gcc with:
tar -xf gcc-7.3.0.tar.xz
cd gcc-7.3.0
./contrib/download_prerequisites
sudo yum install -y gcc-c++
./configure --disable-multilib --enable-languages=c,c++
make -j

Then copy the files from /usr/local/lib64 into the repo.
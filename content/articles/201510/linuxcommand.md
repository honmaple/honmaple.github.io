TITLE: linux的一些操作命令
Author:honmaple 
Date: 2015-10-15 07:44
Category: linux
Tags: linux
Slug: linuxcommand
Summary: 一些linux下的基本操作命令，linux下命令太多，不可能完全记住，记个笔记还是有必要的

### 字符界面播放ascii视频
```
$ mplayer -vo caca MovieName
```

### 打开nvidia设置
```
$ optirun nvidia-settings -c :8
```

### 更新google禁用 GPG 签名检查
```
$ sudo dnf update google-chrome-stable* --nogpgcheck
```

### 字符界面使用鼠标
```
$ sudo dnf install gpm
$ sudo service gpm start
```

### 新字体安装  
字体目录下运行
```
$ mkfontscale
$ mkfontdir
$ fc-cache -fv
```

### ssh代理
```
$ ssh -qTfnN -D 7070 ~@~
```

### 安装vimdoc

`./vimcdoc.sh -i` 安装

`./vimcdoc.sh -u` 卸载

### 编译Youcompleteme
```
$ ./install.sh --clang-completer
```

### vim安装bundle插件管理
```
$ git clone https://github.com/gmarik/vundle.git ~/.vim/bundle/vundle
```


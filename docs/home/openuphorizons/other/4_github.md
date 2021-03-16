---
title: 添加多个Ssh Key到一台电脑
---

## 生成ssh-key
* 生成第一个ssh key，第一个去默认名字，直接一直回车
```sh 
ssh-keygen -t rsa -C "1322287292@qq.com”
```
* 生成第二个ssh key， 在第一个输入的时候，输入一个名字我这里输入的是: id_rsa_github
#### 这时应该有四个文件
![ssh-key](/img/pwc/sshkey2.png)

## 使用ssh-key
Setting -> SSH and GPG keys -> New SSH key
![ssh-key](/img/pwc/ssh_key_1.png)

## 添加私钥
```sh 
  ssh-add ~/.ssh/id_rsa 
```
```sh 
  ssh-add ~/.ssh/id_rsa_github
```
如果出现下面的情况
```sh 
如果执行ssh-add时提示”Could not open a connection to your authentication agent”，
```

可执行命令:
```sh 
$ ssh-agent bash
```
然后再重新运行ssh-add命令：
```sh 
  ssh-add ~/.ssh/id_rsa 
```
```sh 
  ssh-add ~/.ssh/id_rsa_github
```
添加后我们可以通过 ssh-add -l 来确私钥列表
```sh  
$ ssh-add -l
```
![ssh-key](/img/pwc/sshkey3.png)
如果想删除私钥列表，可以通过 ssh-add -D 来清空私钥列表
```sh 
$ ssh-add -D
```
## 创建config文件（无后缀）
::: danger 注意
IdentityFile 要写 /
:::
```sh 
# github.com
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile C:/Users/sizegang/.ssh/id_rsa_github
User Memorydoc
 
# github.com
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile C:/Users/sizegang/.ssh/id_rsa
User Memorydoc123
```
## 5.测试
```sh 
$ ssh -T git@github.com
```
![ssh-key](/img/pwc/sshkey4.png)


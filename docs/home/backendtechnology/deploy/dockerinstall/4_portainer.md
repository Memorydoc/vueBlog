---
title: docker 安装portainer 
---

## docker-compose.yml
```sh  
version: '3.1'
services:
  portainer:
    restart: always
    image: portainer/portainer
    container_name: sizegang-portainer
    ports:
      - 7000:7000
      - 9000:9000
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./portainer_data:/data portainer/portainer

```
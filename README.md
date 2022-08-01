# backend-api
Index.as backend api

// TELEPRESENCE Cloud service yöntemi
1-) ssh indexas
2-) Kubernetes test için kubectl get pods
3-) kubectl get svc --> servisleri gösterir
4-) kubectl get deployments --> çalışan yazılımlar
5-) telepresence connect --> telepresence bağlanır -> makine şifresi
6-) telepresence quit --> çıkış
7-) redis-cli -h adcenter-redis-master.prod -p 6379 --> Redise local makineden bağlanma (normalde buna gerek yok client üzerinden bağlancaz)

createClient({
  url: 'redis://alice:foobared@awesome.redis.server:6380'
});

docker yöntemi
1-) docker run -d --name redis-test -p 6379:6379 redis
2-) docker ps -> running containers

elastic search docker
docker run -d --name elasticsearch-test --env discovery.type=single-node --env xpack.security.enabled=false -p 9200:9200 docker.elastic.co/elasticsearch/elasticsearch:8.1.0
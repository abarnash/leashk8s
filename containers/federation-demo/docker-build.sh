docker build -f ./dockerfiles/accounts.dockerfile -t accounts . && docker tag accounts:latest abarnash/accounts:latest && docker push abarnash/accounts:latest

docker build -f ./dockerfiles/gateway.dockerfile -t gateway . && docker tag gateway:latest abarnash/gateway:latest && docker push abarnash/gateway:latest

docker build -f ./dockerfiles/inventory.dockerfile -t inventory . && docker tag inventory:latest abarnash/inventory:latest && docker push abarnash/inventory:latest

docker build -f ./dockerfiles/products.dockerfile -t products . && docker tag products:latest abarnash/products:latest && docker push abarnash/products:latest

docker build -f ./dockerfiles/reviews.dockerfile -t reviews . && docker tag reviews:latest abarnash/reviews:latest && docker push abarnash/reviews:latest

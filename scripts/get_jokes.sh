TOKEN=$(curl -d '{"username": "'"$1"'", "password": "'"$2"'"}' -H "Content-Type: application/json" -X POST "https://lambda-school-2-zoverlvx.c9users.io/api/login" | jq -r '.token');
echo "Here is the token: $TOKEN"
curl -H "Accept: application/json" -H "Authorization: $TOKEN" -X GET "https://lambda-school-2-zoverlvx.c9users.io/api/jokes"

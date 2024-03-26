import json
import os

from fastapi import FastAPI

# from goods_categorizer.categorizer import GoodsCategorizer
# from goods_categorizer.config import DATA_DIR


#from backend.categorizer import NeuralSearcher
from backend.categorizer import NeuralSearcher
from backend.categorizer import DATA_DIR

app = FastAPI()

#neural_searcher = GoodsCategorizer()
neural_searcher = NeuralSearcher(collection_name='zalando')

graph_path = os.path.join(DATA_DIR, 'graph_en.json')


#@app.get("/api/categorize")
# async def categorize(q: str):
#     return {
#         "result": neural_searcher.categorize(good=q)
#     }

@app.get("/api/categorize")
async def categorize(q: str):
    return {
        "result": neural_searcher.search(text=q)
    }


@app.get("/api/embed")
async def embed(q: str):
    return {
        "result": neural_searcher.embed(good=q)
    }


@app.get("/api/graph")
async def get_graph():
    with open(graph_path) as fd:
        return json.load(fd)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
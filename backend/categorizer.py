import os
from collections import defaultdict
from functools import lru_cache
from pprint import pprint
import numpy as np

from qdrant_client import QdrantClient

from backend.config import DATA_DIR, QDRANT_HOST, QDRANT_PORT, COLLECTION_NAME
from backend.vectorizer.dm_reduction import DmReduction
from backend.vectorizer.vectorizer import Vectorizer


from sentence_transformers import SentenceTransformer


MAPPER_PATH = os.path.join(DATA_DIR, 'mapper.pkl')


def softmax(x):
    return np.exp(x) / sum(np.exp(x))


class GoodsCategorizer:
    def __init__(self):
        self.vectorizer = Vectorizer()
        self.mapper = DmReduction(MAPPER_PATH)
        self.qdrant_client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

    def categorize(self, good: str):
        vector = self.vectorizer.model.encode(good, show_progress_bar=False)
        result = self.qdrant_client.search(COLLECTION_NAME, query_vector=vector.tolist(), top=3, append_payload=True)
        categories = defaultdict(float)
        for hit, payload in result:
            categories[(payload['top_category'], payload['category'])] += hit.score

        categories = sorted(categories.items(), key=lambda x: x[1], reverse=True)

        categories = [
            {
                "category": cat,
                "top_category": top_cat,
                "score": score
            }
            for (top_cat, cat), score in categories
        ]

        return {
            "categories": categories,
        }

    @lru_cache(1000)
    def embed(self, good: str):
        vector = self.vectorizer.model.encode(good, show_progress_bar=False)
        return {
            "embedding": self.mapper.mapper.transform([vector])[0].tolist()
        }



class NeuralSearcher:
    def __init__(self, collection_name):
        self.collection_name = collection_name
        # Initialize encoder model
        self.model = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
        # initialize Qdrant client
        self.qdrant_client = QdrantClient("http://localhost:6333")

        self.vectorizer = Vectorizer()
        self.mapper = DmReduction(MAPPER_PATH)

    # def __init__(self):
    #     self.vectorizer = Vectorizer()
    #     self.mapper = DmReduction(MAPPER_PATH)
    #     self.qdrant_client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)



    def search(self, text: str):
        # Convert text query into vector
        vector = self.model.encode(text).tolist()

        # Use `vector` for search for closest vectors in the collection
        search_result = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=vector,
            query_filter=None,  # If you don't want any filters for now
            limit=5,  # 5 the most closest results is enough
        )
        # `search_result` contains found vector ids with similarity scores along with the stored payload
        # In this function you are interested in payload only
        payloads = [hit.payload for hit in search_result]
        return payloads

    @lru_cache(1000)
    def embed(self, good: str):
        #vector = self.model.encode(good, show_progress_bar=False)
        print("embed", good)
        vector = self.model.encode(good).tolist()
        return {
            #"embedding": self.mapper.mapper.transform([vector])[0].tolist()
            "embedding": vector
        }

if __name__ == '__main__':
    #categorizer = GoodsCategorizer()
    # print("loaded")
    # res = categorizer.categorize("Система охлаждения CPU")
    # pprint(res)
    # res = categorizer.categorize("набор тарелок")
    # pprint(res)

    categorizer = NeuralSearcher(collection_name='zalando')

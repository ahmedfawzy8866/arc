import json
import os
from datetime import datetime
from typing import List, Dict, Any

class GravityMemory:
    """
    Gravity Memory Engine (GME)
    A persistent, weighting-based knowledge system for Sierra Blu.
    """
    def __init__(self, vault_path: str = "memory/vault.json"):
        self.vault_path = vault_path
        self.memory = self._load_vault()

    def _load_vault(self) -> Dict[str, Any]:
        if not os.path.exists(self.vault_path):
            return {
                "metadata": {
                    "initialized": datetime.now().isoformat(),
                    "total_facts": 0,
                    "version": "1.0.0"
                },
                "knowledge_graph": {
                    "compounds": {},
                    "clients": {},
                    "market_trends": {},
                    "operational_logs": {}
                }
            }
        with open(self.vault_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def save(self):
        with open(self.vault_path, 'w', encoding='utf-8') as f:
            json.dump(self.memory, f, indent=4, ensure_ascii=False)

    def ingest_fact(self, category: str, sub_category: str, fact: Any, weight: int = 1):
        """
        Ingests a new fact into binary/gravity memory.
        Higher weight = more 'gravity' (importance).
        """
        timestamp = datetime.now().isoformat()
        entry = {
            "fact": fact,
            "weight": weight,
            "timestamp": timestamp
        }
        
        if category not in self.memory["knowledge_graph"]:
            self.memory["knowledge_graph"][category] = {}
        
        if sub_category not in self.memory["knowledge_graph"][category]:
            self.memory["knowledge_graph"][category][sub_category] = []
            
        self.memory["knowledge_graph"][category][sub_category].append(entry)
        self.memory["metadata"]["total_facts"] += 1
        self.save()
        print(f"✅ Gravity: Ingested fact into {category}:{sub_category}")

    def query_memory(self, category: str, sub_category: str = None) -> List[Dict]:
        """Queries the gravity vault for specific knowledge."""
        cat_data = self.memory["knowledge_graph"].get(category, {})
        if sub_category:
            return cat_data.get(sub_category, [])
        return cat_data

if __name__ == "__main__":
    # Internal test
    g = GravityMemory()
    g.ingest_fact("compounds", "Mivida", "Average 3BR price reached 15M EGP in Apr 2026", weight=5)
    print("Testing Query:", g.query_memory("compounds", "Mivida"))

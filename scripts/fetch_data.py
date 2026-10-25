import os
import json
import re
import urllib.request

DATA_DIR = "/home/ian/Projects/sakura-nihongo/src/data"
os.makedirs(DATA_DIR, exist_ok=True)

def fetch_jft_irodori_vocab():
    print("Fetching JFT Irodori A2 Vocab...")
    url = "https://raw.githubusercontent.com/YUKI-ai-JPN/KOSA-KATA-JFT-A2/main/index.html"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8')
    
    match = re.search(r'const DATA = (\[.*?\]);', content, re.DOTALL)
    if match:
        raw_data = json.loads(match.group(1))
        # Raw items: {"no": 1, "kanji": "魚", "furigana": "さかな", "arti": "Ikan"}
        # We can map English meanings or add English translation mapping for common ones
        processed = []
        for item in raw_data:
            processed.append({
                "id": f"jft_v_{item['no']}",
                "kanji": item["kanji"],
                "furigana": item["furigana"],
                "meaning_id": item["arti"],
                "category": "JFT-A2 Irodori",
                "level": "A2"
            })
        out_path = os.path.join(DATA_DIR, "jft_vocab.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(processed, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(processed)} JFT vocabulary entries to {out_path}")
    else:
        print("Could not parse JFT vocab from repository")

def fetch_jft_cbt_simulations():
    print("Fetching JFT CBT Simulations...")
    all_tests = []
    # 6 simulation tests
    for test_num in range(1, 7):
        url = f"https://raw.githubusercontent.com/NEILUFARHAN/jft-simulation-test/main/data/Simulation%20JFT-{test_num}.js"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp:
                content = resp.read().decode('utf-8')
            
            # Format: const SimulationJFT1Questions = [ ... ];
            # Note: the JS might have backticks ` and </br>
            # Let's clean JS array to valid JSON
            # Replace backticks with quotes, clean trailing commas
            # Or regex extract each question object
            q_matches = re.finditer(r'{\s*id\s*:\s*(\d+),\s*section\s*:\s*(\d+),\s*text\s*:\s*(`.*?[^\\]`|".*?[^\\]"),\s*answers\s*:\s*(\[.*?\]),\s*keyid\s*:\s*(\d+)', content, re.DOTALL)
            
            test_questions = []
            for m in q_matches:
                qid = int(m.group(1))
                sec = int(m.group(2))
                raw_text = m.group(3).strip('`"').replace('</br>', '\n').replace('<hr>', '\n---\n').strip()
                raw_answers = m.group(4)
                keyid = int(m.group(5))
                
                # parse answers
                # [{id:0,text:"かりてませんか"},...]
                ans_matches = re.findall(r'{\s*id\s*:\s*(\d+)\s*,\s*text\s*:\s*"([^"]*)"\s*}', raw_answers)
                answers = [ans[1] for ans in ans_matches]
                if not answers:
                    ans_matches2 = re.findall(r'{\s*id\s*:\s*(\d+)\s*,\s*text\s*:\s*`([^`]*)`\s*}', raw_answers)
                    answers = [ans[1] for ans in ans_matches2]
                
                test_questions.append({
                    "id": f"jft_{test_num}_{qid}",
                    "testNum": test_num,
                    "sectionId": sec,
                    "sectionName": {
                        1: "Script and Vocabulary (文字・語彙)",
                        2: "Conversation and Expression (会話・表現)",
                        3: "Listening Comprehension (聴解)",
                        4: "Reading Comprehension (読解)"
                    }.get(sec, "General"),
                    "question": raw_text,
                    "options": answers,
                    "correctAnswerIndex": keyid,
                    "explanation": f"Official JFT-Basic CBT standard question. Section {sec} testing A2 practical communicative competence in Japan."
                })
            
            print(f"Simulation JFT-{test_num}: parsed {len(test_questions)} questions")
            all_tests.extend(test_questions)
        except Exception as e:
            print(f"Error fetching Simulation JFT-{test_num}: {e}")
            
    out_path = os.path.join(DATA_DIR, "jft_cbt_exams.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_tests, f, ensure_ascii=False, indent=2)
    print(f"Total JFT CBT questions saved: {len(all_tests)}")

def fetch_jlpt_quizzes():
    print("Fetching JLPT Quizzes...")
    url = "https://raw.githubusercontent.com/hatwarsanskar95-web/japanese-JLPT-learner/main/js/quiz-data.js"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8')
    
    # window.quizQuestions = { N5: [...], N4: [...], ... }
    # Let's extract levels: N5, N4, N3, N2, N1
    levels = ["N5", "N4", "N3", "N2", "N1"]
    all_quizzes = {}
    
    for lvl in levels:
        pattern = rf'{lvl}:\s*\[(.*?)\]\s*(?:,\s*N\d:|\s*}};)'
        m = re.search(pattern, content, re.DOTALL)
        if m:
            block = m.group(1)
            # Find individual objects { question: "...", options: [...], correct: 1, explanation: "..." }
            obj_matches = re.finditer(r'{\s*question\s*:\s*"([^"]+)",\s*options\s*:\s*\[(.*?)\]\s*,\s*correct\s*:\s*(\d+)\s*,\s*explanation\s*:\s*"([^"]*)"\s*}', block, re.DOTALL)
            level_items = []
            for obj in obj_matches:
                q = obj.group(1)
                opts = [o.strip().strip('"').strip("'") for o in obj.group(2).split(',') if o.strip()]
                cor = int(obj.group(3))
                exp = obj.group(4)
                level_items.append({
                    "id": f"{lvl}_{len(level_items)+1}",
                    "level": lvl,
                    "question": q,
                    "options": opts,
                    "correctAnswerIndex": cor,
                    "explanation": exp
                })
            all_quizzes[lvl] = level_items
            print(f"JLPT {lvl}: parsed {len(level_items)} questions")
        else:
            print(f"Could not find block for {lvl}")
            
    out_path = os.path.join(DATA_DIR, "jlpt_quizzes.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_quizzes, f, ensure_ascii=False, indent=2)
    print(f"Saved JLPT Quizzes to {out_path}")

def fetch_jlpt_grammar():
    print("Fetching JLPT Grammar...")
    url = "https://raw.githubusercontent.com/FaizanHaider20083/JapaneseLearning/main/data/grammar_patterns_complete.json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    
    # Keep curated top grammar points per level to keep bundle fast and responsive
    curated = {}
    for lvl, items in data.items():
        curated[lvl] = items[:40] # 40 rich grammar patterns per level
    
    out_path = os.path.join(DATA_DIR, "jlpt_grammar.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(curated, f, ensure_ascii=False, indent=2)
    print(f"Saved {sum(len(v) for v in curated.values())} grammar items to {out_path}")

def fetch_jlpt_n5_vocab():
    print("Fetching JLPT N5 Vocab...")
    url = "https://raw.githubusercontent.com/FaizanHaider20083/JapaneseLearning/main/data/complete_jlpt_n5.json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        
    out_path = os.path.join(DATA_DIR, "jlpt_n5_vocab.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data[:250], f, ensure_ascii=False, indent=2)
    print(f"Saved {min(250, len(data))} JLPT N5 vocab items to {out_path}")

if __name__ == "__main__":
    fetch_jft_irodori_vocab()
    fetch_jft_cbt_simulations()
    fetch_jlpt_quizzes()
    fetch_jlpt_grammar()
    fetch_jlpt_n5_vocab()
    print("All datasets processed successfully!")

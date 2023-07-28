import { wordlist } from './wordlist';

class TrieNode {
  children: { [key: string]: TrieNode } = {};
  endOfWord = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let currentNode = this.root;
    for (const char of word) {
      if (!currentNode.children[char]) {
        currentNode.children[char] = new TrieNode();
      }
      currentNode = currentNode.children[char];
    }
    currentNode.endOfWord = true;
  }

  search(word: string): boolean {
    let currentNode = this.root;
    for (const char of word) {
      if (!currentNode.children[char]) {
        return false;
      }
      currentNode = currentNode.children[char];
    }
    return currentNode.endOfWord;
  }
}

// Initialize your Trie and add all your bad words to it
const badWordsTrie = new Trie();
for (const word of wordlist) {
  badWordsTrie.insert(word);
}

export const containsBadWord = (text: string): boolean => {
  const words = text.toLowerCase().split(/[\s-]+/); // split by space or dash
  for (const word of words) {
    if (badWordsTrie.search(word)) {
      return true;
    }
  }
  return false;
};

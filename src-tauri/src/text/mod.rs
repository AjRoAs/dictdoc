use std::collections::HashMap;

pub struct TextProcessor {
    replacements: HashMap<String, String>,
}

impl TextProcessor {
    pub fn new() -> Self {
        let mut replacements = HashMap::new();
        replacements.insert("tylenol".to_string(), "Tylenol".to_string());
        replacements.insert("advil".to_string(), "Advil".to_string());
        replacements.insert("mg".to_string(), "mg".to_string());
        replacements.insert("po".to_string(), "p.o.".to_string());
        replacements.insert("bid".to_string(), "b.i.d.".to_string());

        Self { replacements }
    }

    pub fn add_replacement(&mut self, from: String, to: String) {
        self.replacements.insert(from.to_lowercase(), to);
    }

    pub fn process(&self, text: &str) -> String {
        let mut result = String::new();
        let words = text.split_whitespace();

        for (i, word) in words.enumerate() {
            if i > 0 {
                result.push(' ');
            }

            let clean_word = word.to_lowercase()
                .trim_matches(|c: char| !c.is_alphanumeric())
                .to_string();

            if let Some(replacement) = self.replacements.get(&clean_word) {
                 result.push_str(replacement);
            } else {
                result.push_str(word);
            }
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_replacement() {
        let processor = TextProcessor::new();
        let input = "take two tylenol and call me";
        let output = processor.process(input);
        assert_eq!(output, "take two Tylenol and call me");
    }

    #[test]
    fn test_medical_abbr() {
        let processor = TextProcessor::new();
        let input = "10 mg po bid";
        let output = processor.process(input);
        assert_eq!(output, "10 mg p.o. b.i.d.");
    }
}

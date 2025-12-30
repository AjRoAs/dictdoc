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

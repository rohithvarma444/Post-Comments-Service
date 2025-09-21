const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const config = require('../config/config');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

class RichTextProcessor {
  constructor() {

    this.purifyConfig = {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'a'
      ],
      ALLOWED_ATTR: [
        'href', 'title'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    };
  }

  processRichText(content) {
    try {
      if (!content || typeof content !== 'string') {
        return '';
      }

      let html = content;
      
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
      html = html.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      
      html = html.replace(/\n/g, '<br>');

      if (config.richText.sanitize) {
        return DOMPurify.sanitize(html, this.purifyConfig);
      }

      return html;
    } catch (error) {
      console.error('Markdown processing error:', error);
      return content;
    }
  }

  isRichText(content) {
    if (!content || typeof content !== 'string') {
      return false;
    }

    const richTextPatterns = [
      /\*\*.*?\*\*/,
      /\*.*?\*/,
      /<u>.*?<\/u>/,
      /\[.*?\]\(.*?\)/
    ];

    return richTextPatterns.some(pattern => pattern.test(content));
  }

  processContent(content, isRichText = false) {
    if (!content) return '';

    if (isRichText || this.isRichText(content)) {
      return {
        content: this.processRichText(content),
        isRichText: true
      };
    }

    const escapedContent = this.escapeHtml(content);
    const contentWithBreaks = escapedContent.replace(/\n/g, '<br>');

    return {
      content: contentWithBreaks,
      isRichText: false
    };
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  extractPlainText(html) {
    if (!html) return '';

    try {
      const text = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();

      return text;
    } catch (error) {
      console.error('Plain text extraction error:', error);
      return html;
    }
  }

  generatePreview(content, maxLength = 150) {
    const plainText = this.extractPlainText(content);
    
    if (plainText.length <= maxLength) {
      return plainText;
    }

    return plainText.substring(0, maxLength).trim() + '...';
  }
}

module.exports = new RichTextProcessor();

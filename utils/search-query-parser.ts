export interface ParsedSearchQuery {
  terms: string[];
  excludeTerms: string[];
  hasOrOperator: boolean;
  hasNotOperator: boolean;
}

export class SearchQueryParser {
  private static readonly OPERATORS = {
    OR: '|',
    NOT: '-'
  } as const;

  static parse(query: string): ParsedSearchQuery {
    if (!query?.trim()) {
      return this.createEmptyResult();
    }

    const result: ParsedSearchQuery = {
      terms: [],
      excludeTerms: [],
      hasOrOperator: false,
      hasNotOperator: false
    };

    let processedQuery = query.trim();

    // NOT 연산자 처리 (예: "javascript -react")
    processedQuery = this.extractExcludeTerms(processedQuery, result);

    // OR 연산자 처리 (예: "javascript|typescript")
    this.extractSearchTerms(processedQuery, result);

    return result;
  }

  private static createEmptyResult(): ParsedSearchQuery {
    return {
      terms: [],
      excludeTerms: [],
      hasOrOperator: false,
      hasNotOperator: false
    };
  }

  private static extractExcludeTerms(
    query: string,
    result: ParsedSearchQuery
  ): string {
    // 패턴: -단어 (공백이나 OR 연산자 앞에 오는 - 제외)
    const notPattern = new RegExp(
      `\\${this.OPERATORS.NOT}\\s*([^\\s\\${this.OPERATORS.OR}]+)`,
      'g'
    );
    const notMatches = query.match(notPattern);

    if (notMatches) {
      result.hasNotOperator = true;
      notMatches.forEach((match) => {
        const term = match.replace(
          new RegExp(`^\\${this.OPERATORS.NOT}\\s*`),
          ''
        );
        result.excludeTerms.push(term);
        query = query.replace(match, '');
      });
    }

    return query;
  }

  private static extractSearchTerms(
    query: string,
    result: ParsedSearchQuery
  ): void {
    if (query.includes(this.OPERATORS.OR)) {
      result.hasOrOperator = true;

      const orTerms = query
        .split(this.OPERATORS.OR)
        .map((term) => term.trim())
        .filter(Boolean);
      result.terms.push(...orTerms);
    } else {
      // 일반 검색 (공백으로 구분)
      const terms = query.split(/\s+/).filter(Boolean);
      result.terms.push(...terms);
    }
  }

  static isValidQuery(parsedQuery: ParsedSearchQuery): boolean {
    return parsedQuery.terms.length > 0 || parsedQuery.excludeTerms.length > 0;
  }
}

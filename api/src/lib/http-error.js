/**
 * Erro de aplicação com status HTTP associado.
 * É convertido em uma resposta no formato Problem Details (RFC 9457)
 * pelo middleware de erros.
 */
export class HttpError extends Error {
  /**
   * @param {number} status código de status HTTP
   * @param {string} title resumo curto do problema
   * @param {string} [detail] explicação específica da ocorrência
   * @param {Array<object>} [errors] lista de erros de validação por campo
   */
  constructor(status, title, detail, errors) {
    super(detail ?? title);
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.errors = errors;
  }

  /** @param {string} detail */
  static notFound(detail) {
    return new HttpError(404, 'Recurso não encontrado', detail);
  }

  /** @param {string} detail */
  static conflict(detail) {
    return new HttpError(409, 'Conflito com o estado atual do recurso', detail);
  }

  /** @param {string} detail */
  static unprocessable(detail) {
    return new HttpError(422, 'Regra de negócio violada', detail);
  }
}

export interface IRequest<_TResponse = void> {}

export interface IRequestHandler<TRequest extends IRequest<TResponse>, TResponse = void> {
  handle(request: TRequest): Promise<TResponse>;
}

export interface IMediator {
  send<TResponse>(request: IRequest<TResponse>): Promise<TResponse>;
  registerHandler<TRequest extends IRequest<TResponse>, TResponse>(
    requestType: new (...args: any[]) => TRequest,
    handler: IRequestHandler<TRequest, TResponse>
  ): void;
}

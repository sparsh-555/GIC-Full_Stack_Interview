import { injectable } from 'tsyringe';
import { IMediator, IRequest, IRequestHandler } from './IMediator';

@injectable()
export class Mediator implements IMediator {
  private handlers = new Map<string, IRequestHandler<any, any>>();

  registerHandler<TRequest extends IRequest<TResponse>, TResponse>(
    requestType: new (...args: any[]) => TRequest,
    handler: IRequestHandler<TRequest, TResponse>
  ): void {
    this.handlers.set(requestType.name, handler);
  }

  async send<TResponse>(request: IRequest<TResponse>): Promise<TResponse> {
    const handler = this.handlers.get(request.constructor.name);

    if (!handler) {
      throw new Error(`No handler registered for ${request.constructor.name}`);
    }

    return handler.handle(request);
  }
}

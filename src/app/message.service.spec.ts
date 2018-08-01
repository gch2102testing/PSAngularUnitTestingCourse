import { MessageService } from "./message.service";

describe('MessageService', () =>{
    let service: MessageService;

    beforeEach(() =>{
        // arrange - initialize objects
        service = new MessageService();
    });

    it('should have no messages to start', () =>{
        // assert - verify 
        expect(service.messages.length).toBe(0);
    });

    it('should add a message when add is called', () =>{
        // act invokes method to test
        service.add('message1');

        // assert
        expect(service.messages.length).toBe(1);
    })

    it('should remove all messsages when clear is called', () =>{
        service.add('message1');
        // act invokes method to test
        service.clear();

        // assert
        expect(service.messages.length).toBe(0);
    })
})
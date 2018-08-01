import { MessageService } from './message.service';
import { HeroService } from './hero.service';
import { TestBed, inject } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";


describe('HeroService', () =>{
    let mockMessageService;
    let httpTestingController: HttpTestingController;
    let service: HeroService;

    beforeEach(() => {
        mockMessageService = jasmine.createSpyObj(['add']);
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                HeroService,
                //following message service is not used by this test but is required
                //for the hero.service, and messageService only uses the add function
                { provide: MessageService, useValue: mockMessageService }
            ]
        });

        // TestBed.get(service name) will return an instance of that service
        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(HeroService);
    });

    describe('getHero', () => {

        it('should call get with the correct URL', 
            // inject([
            //     HeroService,
            //     HttpTestingController
            // ], (service: HeroService, controller: HttpTestingController) => {
            () => {
            service.getHero(4).subscribe();

            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush({id: 4, name: 'SuperDude', strength: 100});
            httpTestingController.verify(); //verifies that getHero was passed '4'
        });
    });
})
import { HeroComponent } from './../hero/hero.component';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HeroService } from './../hero.service';
import { promise } from 'selenium-webdriver';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HeroesComponent } from "./heroes.component";
import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';
import { Hero } from '../hero';

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Wonderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
        ]

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        component = new HeroesComponent(mockHeroService);
    });

    describe('delete', () =>{
      it('should remove the indicated hero from the heroes list', () => {
          mockHeroService.deleteHero.and.returnValue(of(true)); //simulates a return value
          component.heroes = HEROES;

          component.delete(HEROES[2]);

          //expect(component.heroes.length).toBe(2);
          expect(component.heroes.filter( h => h !== HEROES[2]).length).toBe(HEROES.length-1);
      });

      /**
       * the service itself does not affect the state of the component 
       * and hence the result doesn't mather.
       * 
       * However, we still need to verify that the delete function sends
       * the right arguments to the deleteHero function for the service
       */
      it('should call deleteHero with the correct Hero', () => {
        mockHeroService.deleteHero.and.returnValue(of(true)); //simulates a return value
        component.heroes = HEROES;

        component.delete(HEROES[2]);
        //This makes sure the line of code was called
        expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
      });
    });
});

/**
 * handles in this shallow integration test
 *  a) mock service
 *  b) fake child component
 */
describe('HerosComponent (shallow)', () =>{
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    @Component({
        selector: 'app-hero',
        template: '<div></div>'
    })
    class FakeHeroComponent {
        @Input() hero: Hero;
        //@Output() delete = new EventEmitter();
    }

    beforeEach(() =>{
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        HEROES = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Wonderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
        ]

        // calls ngoninit lifecycle which setups heros
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                FakeHeroComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            //schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should set Heroes correctly from the service', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        expect(fixture.componentInstance.heroes.length).toBe(3);
    })

    it('should create one li for each hero', () =>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
    })
})

describe('HerosComponent (deep)', () =>{
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() =>{
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        HEROES = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Wonderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
        ]

        // calls ngoninit lifecycle which setups heros
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            schemas:[
                NO_ERRORS_SCHEMA
            ]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as HeroComponent', () =>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        //run ngOnInit
        fixture.detectChanges();
        
        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toEqual(3);
        for (let i=0; i < heroComponentDEs.length; i++){
            expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    });

    it(`should call the heroService.deleteHero when the Hero Component's 
        delete button is clicked`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        //run ngOnInit
        fixture.detectChanges();

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        
        //ignore click, but simulates emit
        for (let i=0; i<HEROES.length; i++){
            (<HeroComponent>heroComponentDEs[i].componentInstance).delete.emit(undefined);
            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[i]);
        }

        //simulates click
        for (let i=0; i<HEROES.length; i++){
            heroComponentDEs[i].query(By.css('button'))
                .triggerEventHandler('click', {stopPropagation: () => {}})
            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[i]);
        }

        //simulate delete trigger rather than the click
        for (let i=0; i<HEROES.length; i++){
            heroComponentDEs[i].triggerEventHandler('delete', null);
            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[i]);
        }
    })
});
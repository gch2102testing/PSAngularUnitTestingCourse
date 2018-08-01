import { ActivatedRoute } from '@angular/router';
import { HeroComponent } from './hero.component';
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeroComponent', () =>{
    //fixture is a wrapper for a component used for testing
    // and gives access to the instance of the component being tested
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
        //testing module is just like the ngModule
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA] //used to ignore "<a routerLink" as routerLink is not a normal <a> directive
        });
        fixture = TestBed.createComponent(HeroComponent);
    });

    /**
     * This only tests the "input" workflow of the component
     */
    it('should have the correct hero', () => {
        fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3};

        expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
    });

    /**
     * This tests the actual input bindings as per the componnt template
     */
    it('should render the hero name in the anchor tag', () =>{
        fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3};
        fixture.detectChanges(); // run change detection and update bindings - needed to see DOM properties

        let deA = fixture.debugElement.query(By.css('a'));
        expect(deA.nativeElement.textContent).toContain('SuperDude');
        //expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
    })
})
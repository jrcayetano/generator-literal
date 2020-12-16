import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'generator-literal';
  form: FormGroup;
  terminal = [];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.generateForm();

  }

  onGenerate() {
    console.log(this.form.value);
    const json = JSON.parse(this.form.get('json').value);
    const screens: string [] = this.getScreenNames();
    const languages: string [] = this.getLanguages();
    this.SQLgenerator(json, screens, languages);
  }

  private getScreenNames() {
    const screens = [];
    if(this.form.get('accountdata').value) {
      screens.push('accountdata');
    }
    return screens;
  }

  getLanguages() {
    const languages = [];
    if(this.form.get('sp').value) {
      languages.push('es');
    }
    if(this.form.get('en').value) {
      languages.push('en');
    }
    if(this.form.get('fr').value) {
      languages.push('fr');
    }
    if(this.form.get('pt').value) {
      languages.push('pt');
    }
    if(this.form.get('ca').value) {
      languages.push('ca');
    }
    return languages;
  }

  private generateForm() {
    this.form = this.fb.group({
      json: [''],
      accountdata: [false],
      sp: [true],
      en: [true],
      fr: [true],
      pt: [true],
      ca: [true]
    })
  }


  private SQLgenerator(json, screenNames: string[], languages: string []) {
    let sqls = [];
    if (!screenNames || screenNames.length === 0) {
      alert('No has seleccionado pantalla')
      return;
    }

    for (let property in json ) {
      if(json[property]) {
        const sqlLanguage = this.sqlLanguage(languages, property, json[property]);
        const sqlscreen = this.sqlScreen(screenNames, property);
        let sqlLiteral = [];
        sqlLiteral = [].concat(...sqlLanguage,...sqlscreen);
        sqlLiteral.unshift(`-- ${property}`);
        sqlLiteral.push('-- ---------------------------------------------------------------------------------------------------------');
        sqls.push(sqlLiteral);

      }
    }

    this.terminal = sqls;
    console.log(this.terminal);

  }

  private sqlLanguage (languages: string [], key:string, value:string) {
    const sql = [];

    for(const lang of languages) {
      const translated = lang === 'es' ? value : `${value}_${lang}`;
      sql.push([
        `INSERT INTO INTE_RESO_BUND (IDN, KEY_NAM, VAL, LOC, FEC_REG_BD, FEC_ULT_ACT, DATO_PERS_REG_BD, DATO_PERS_ULT_ACT) VALUES (INTE_RESO_BUND_SEC.NEXTVAL, '${key}', '${translated}', 'labels', SYSDATE, SYSDATE, '4555', '4555');`
      ])
    }
    return sql;

  }

  private sqlScreen(screenNames: string [], literal: string) {
    const sql = [];
    for(const screen of screenNames) {
      sql.push([
        `insert into ctlg_pant_elem (CTLG_PANT, INT_RES_BUN, OBS, IND_REV_MAN, NUM_REP, IND_TIP_ELE, FEC_REG_BD, FEC_ULT_ACT, DATO_PERS_REG_BD, DATO_PERS_ULT_ACT, IND_EXT_PRO, BUG, CTLG_SUBB_PANT) values ('${screenNames}','${literal}', '', '', 1, 'E', SYSDATE, SYSDATE, 4555, 4555, '', '', null);`
      ])
    }
    return sql;
  }
}

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { drawingMode } from './drawingMode';
import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit {
  //@ts-ignore
  @ViewChild('stageContainer') stageContainer: ElementRef;

  stage: any;

  // Для фигуры (через точки)
  private circlePoint: any[] = [];
  private point: any;
  private points: any[] = [];
  private canAddPoints = true;

  private testArray: any[] = [];

  // Для редактирования

  // private lines: Konva.Line[] = [];
  // //@ts-ignore
  // private currentLine: Konva.Line;
  // //@ts-ignore
  // private startPoint: Konva.Vector2d;

  public layer = new Konva.Layer();
  public transformer = new Konva.Transformer();

  public canvasMode: drawingMode = drawingMode.Default;
  public thickness: number = 5;
  public color: string = 'black';

  public startPos: Konva.Vector2d | null = null;
  public line: any;
  public isDrawing: boolean = false;

  public setModeCreate() {
    this.circlePoint.forEach((element) => {
      element.remove();
    });
    this.layer.batchDraw();

    this.transformer.detach();
    this.layer.draw();
    this.canvasMode = drawingMode.Create;
    this.drawLine();
  }

  public setMoreEdit() {
    this.circlePoint.forEach((element) => {
      element.remove();
    });
    this.layer.batchDraw();
    this.circlePoint.forEach((element) => {
      element.remove();
    });
    this.transformer.detach();
    this.layer.draw();
    this.canvasMode = drawingMode.EditMore;
    this.drawLine();
  }

  public setModeDelete() {
    this.circlePoint.forEach((element) => {
      element.remove();
    });
    this.layer.batchDraw();
    this.circlePoint.forEach((element) => {
      element.remove();
    });
    this.transformer.detach();
    this.layer.draw();
    this.canvasMode = drawingMode.Delete;
    this.drawLine();
  }

  public setModeEditMore() {
    this.circlePoint.forEach((element) => {
      element.remove();
    });
    this.layer.batchDraw();
    this.circlePoint.forEach((element) => {
      element.remove();
    });
    this.transformer.detach();
    this.layer.draw();
    this.canvasMode = drawingMode.EditMore;
    this.drawLine();
  }

  public setModeEdit() {
    this.circlePoint.forEach((element) => {
      element.remove();
    });
    this.layer.batchDraw();
    this.circlePoint.forEach((element) => {
      element.remove();
    });
    this.canvasMode = drawingMode.Edit;
    this.drawLine();
  }

  public setModeFigure() {
    this.transformer.detach();
    this.layer.draw();
    this.canvasMode = drawingMode.Figure;
    this.drawLine();
  }

  public drawLine() {
    if (this.canvasMode === drawingMode.Create) {
      this.stage.off('click');
      this.stage.off('mousedown touchstart');
      this.stage.off('mousemove touchmove');
      this.stage.off('mouseup touchend');

      this.stage.on(
        'mousedown touchstart',
        (e: Konva.KonvaEventObject<MouseEvent>) => {
          this.isDrawing = true;
          const pos = this.stage.getPointerPosition() as Vector2d;
          this.startPos = pos;
          this.line = new Konva.Line({
            stroke: this.color,
            strokeWidth: this.thickness,
            points: [pos.x, pos.y, pos.x, pos.y],
          });
          this.layer.add(this.line);
          this.stage.batchDraw();
        }
      );
      this.stage.on(
        'mousemove touchmove',
        (e: Konva.KonvaEventObject<MouseEvent>) => {
          if (!this.isDrawing || !this.startPos) {
            return;
          }
          const pos = this.stage.getPointerPosition() as Vector2d;
          if (this.line) {
            this.line.points([this.startPos.x, this.startPos.y, pos.x, pos.y]);
            this.stage.batchDraw();
          }
        }
      );
      this.stage.on(
        'mouseup touchend',
        (e: Konva.KonvaEventObject<MouseEvent>) => {
          if (!this.isDrawing || !this.startPos) {
            return;
          }
          this.isDrawing = false;
          const endPos = this.stage.getPointerPosition() as Vector2d;
          if (this.line) {
            this.line.points([
              this.startPos.x,
              this.startPos.y,
              endPos.x,
              endPos.y,
            ]);
            this.line = null;
            this.stage.batchDraw();
          }
        }
      );
    } else if (this.canvasMode === drawingMode.Delete) {
      this.stage.off('click');
      this.stage.off('mousedown touchstart');
      this.stage.off('mousemove touchmove');
      this.stage.off('mouseup touchend');

      this.stage.on('click', (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target.className !== undefined) {
          if (
            confirm(
              `Вы действительно хотите удалить фигуру ${e.target.className}`
            )
          ) {
            e.target.destroy();
          }
        }
      });
    } else if (this.canvasMode === drawingMode.Edit) {
      this.stage.off('click');
      this.stage.off('mousedown touchstart');
      this.stage.off('mousemove touchmove');
      this.stage.off('mouseup touchend');

      this.stage.on('click', (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === this.stage) {
          this.transformer.detach();
          this.layer.draw();
          return;
        }

        e.target.draggable(true);
        this.transformer.attachTo(e.target);
      });
    } else if (this.canvasMode === 'figure') {
      this.stage.off('click');
      this.stage.off('mousedown touchstart');
      this.stage.off('mousemove touchmove');
      this.stage.off('mouseup touchend');

      this.stage.on('click', (event: Konva.KonvaEventObject<MouseEvent>) => {
        if (!this.canAddPoints) {
          return;
        }

        this.point = this.stage.getPointerPosition();
        this.points.push(this.point);

        const circle = new Konva.Circle({
          x: this.point.x,
          y: this.point.y,
          radius: 3,
          fill: 'black',
        });

        this.layer.add(circle);
        this.circlePoint.push(circle);
        this.layer.batchDraw();

        if (
          // this.points.length > 1 &&
          // this.points[this.points.length - 1].x === this.points[0].x &&
          // this.points[this.points.length - 1].y === this.points[0].y
          this.points.length > 1 &&
          this.points[this.points.length - 1].x >= this.points[0].x - 3 &&
          this.points[this.points.length - 1].x <= this.points[0].x + 3 &&
          this.points[this.points.length - 1].y >= this.points[0].y - 3 &&
          this.points[this.points.length - 1].y <= this.points[0].y + 3
        ) {
          const flattenedPoints = this.points.flatMap((p) => [p.x, p.y]); // Преобразование точек в числа
          const shape = new Konva.Line({
            points: flattenedPoints,
            stroke: this.color,
            strokeWidth: this.thickness,
          });

          this.circlePoint.forEach((element) => {
            element.remove();
          });

          this.layer.add(shape);
          this.layer.batchDraw();
          this.points = [];
          this.point = undefined;
          this.canAddPoints = false;
        }
      });

      // this.stage.on('mousedown', (e: Konva.KonvaEventObject<MouseEvent>) => {
      //   this.startPoint = this.stage.getPointerPosition();

      //   this.currentLine = new Konva.Line({
      //     stroke: 'black',
      //     strokeWidth: 2,
      //     points: [this.startPoint.x, this.startPoint.y],
      //   });

      //   this.layer.add(this.currentLine);
      // });

      // this.stage.on('mouseup', (e: Konva.KonvaEventObject<MouseEvent>) => {
      //   const endPoint = this.stage.getPointerPosition();

      //   if (
      //     endPoint.x === this.startPoint.x &&
      //     endPoint.y === this.startPoint.y
      //   ) {
      //     this.lines.push(this.currentLine);
      //   }
      //   this.layer.batchDraw();
      // });

      // this.stage.on('mousemove', (e: Konva.KonvaEventObject<MouseEvent>) => {
      //   if (!this.currentLine) {
      //     return;
      //   }

      //   const pos = this.stage.getPointerPosition();

      //   this.currentLine.points([
      //     this.startPoint.x,
      //     this.startPoint.y,
      //     pos.x,
      //     pos.y,
      //   ]);

      //   this.layer.batchDraw();
      // });
    } else if (this.canvasMode === drawingMode.EditMore) {
      this.stage.off('click');
      this.stage.off('mousedown touchstart');
      this.stage.off('mousemove touchmove');
      this.stage.off('mouseup touchend');

      this.stage.on('click', (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === this.stage) {
          this.transformer.detach();
          this.layer.draw();
          this.testArray = [];
          return;
        }

        e.target.draggable(true);

        this.testArray.push(e.target);
        this.transformer.nodes(this.testArray);
      });
    }
  }

  public startFigure() {
    this.canAddPoints = true;
  }

  ngAfterViewInit(): void {
    this.stage = new Konva.Stage({
      //@ts-ignore
      container: this.stageContainer.nativeElement,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.stage.add(this.layer);
    this.layer.add(this.transformer);
  }
}

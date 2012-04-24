#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<ctype.h>
#include<iostream>
typedef struct {
     unsigned char red,green,blue;
} PPMPixel;

typedef struct {
     int x, y;
     PPMPixel *data;
} PPMImage;

#define CREATOR "CHIN-KAI CHANG"
#define RGB_COMPONENT_COLOR 255

static PPMImage *readPPM(const char *filename)
{
         char buff[16];
         PPMImage *img;
         FILE *fp;
         int c, rgb_comp_color;
         //open PPM file for reading
         fp = fopen(filename, "rb");
         if (!fp) {
              fprintf(stderr, "Unable to open file '%s'\n", filename);
              exit(1);
         }

         //read image format
         if (!fgets(buff, sizeof(buff), fp)) {
              perror(filename);
              exit(1);
         }

    //check the image format
    if (buff[0] != 'P' || buff[1] != '6') {
         fprintf(stderr, "Invalid image format (must be 'P6')\n");
         exit(1);
    }

    //alloc memory form image
    img = (PPMImage *)malloc(sizeof(PPMImage));
    if (!img) {
         fprintf(stderr, "Unable to allocate memory\n");
         exit(1);
    }

    //check for comments
    c = getc(fp);
    while (c == '#') {
    while (getc(fp) != '\n') ;
         c = getc(fp);
    }

    ungetc(c, fp);
    //read image size information
    if (fscanf(fp, "%d %d", &img->x, &img->y) != 2) {
         fprintf(stderr, "Invalid image size (error loading '%s')\n", filename);
         exit(1);
    }

    //read rgb component
    if (fscanf(fp, "%d", &rgb_comp_color) != 1) {
         fprintf(stderr, "Invalid rgb component (error loading '%s')\n", filename);
         exit(1);
    }

    //check rgb component depth
    if (rgb_comp_color!= RGB_COMPONENT_COLOR) {
         fprintf(stderr, "'%s' does not have 8-bits components\n", filename);
         exit(1);
    }

    while (fgetc(fp) != '\n') ;
    //memory allocation for pixel data
    img->data = (PPMPixel*)malloc(img->x * img->y * sizeof(PPMPixel));

    if (!img) {
         fprintf(stderr, "Unable to allocate memory\n");
         exit(1);
    }

    //read pixel data from file
    if (fread(img->data, 3 * img->x, img->y, fp) != img->y) {
         fprintf(stderr, "Error loading image '%s'\n", filename);
         exit(1);
    }

    fclose(fp);
    return img;
}
void writePPM(const char *filename, PPMImage *img)
{
    FILE *fp;
    //open file for output
    fp = fopen(filename, "wb");
    if (!fp) {
         fprintf(stderr, "Unable to open file '%s'\n", filename);
         exit(1);
    }

    //write the header file
    //image format
    //comments
    fprintf(fp, "function getTextureImage()\n{\n");
    fprintf(fp, "	// Created a image size  %d x %d\n",img->x,img->y);
    fprintf(fp, "	var img = new Array(%d);\n",img->x);

		fprintf(fp, "	for(var i=0;i<%d;i++){img[i] = new Array(%d);}\n",img->x,img->y);

		
		for(int j=0;j<img->y;j++)
		{
						fprintf(fp,"	//y:%3d\n",j);
			for(int i=0;i<img->x;i++)
			{
						fprintf(fp,"	img[%3d][%3d] = new Array(3);",i,j);
						fprintf(fp,"	img[%3d][%3d][0] = %3d;",   i,j, img->data[j*img->x+i].red);
						fprintf(fp,"	img[%3d][%3d][1] = %3d;",   i,j, img->data[j*img->x+i].green);
						fprintf(fp,"	img[%3d][%3d][2] = %3d;\n", i,j, img->data[j*img->x+i].blue);

			}
		}
		fprintf(fp,"	return img;\n}\n");

    fclose(fp);
}

void changeColorPPM(PPMImage *img)
{
    int i;
    if(img){

         for(i=0;i<img->x*img->y;i++){
              img->data[i].red=RGB_COMPONENT_COLOR-img->data[i].red;
              img->data[i].green=RGB_COMPONENT_COLOR-img->data[i].green;
              img->data[i].blue=RGB_COMPONENT_COLOR-img->data[i].blue;
         }
    }
}
/* Adds an extension to a file name */  
void PutExtension(char *Flnm, char *Extension)  
{  
char  *Period;        /* location of period in file name */  
int		 Samename;  
  
    /* This assumes DOS like file names */  
    if ((Period = strchr(Flnm,'.')) != NULL)  
        *(Period) = '\0';  
  
    Samename = 0;  
    if (strcmp(Extension, Period+1)== 0)  
        Samename = 1;  
  
    strcat(Flnm,".");  
    strcat(Flnm, Extension);  
    if (Samename)  
    {  
        fprintf (stderr,"Input and output filenames (%s) are same.", Flnm);  
        exit(1);  
    }  
} 
int main(int argc, char *argv[]){
		if(argc < 2)
		{
			std::cout<<"usage: "<< argv[0] <<" input.[ppm] (output.[js])\n";
			return 1;
		}
		char ext[5],output[80];
		//default output name is input.ppm -> input.js
		if(argc == 2){
			strcpy(ext, "js"); /* default output file extension */
			strcpy(output,argv[1]);
			PutExtension(output,ext);
			std::cout<<"Default Ouput Name is "<<output<<"\n";
		}else{
			strcpy(output,argv[2]);
		}  
    PPMImage *image;
    image = readPPM(argv[1]);
    writePPM(output,image);
    printf("Output %s ,Press any key...",output);
    getchar();
}

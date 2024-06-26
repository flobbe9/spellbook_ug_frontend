import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/props/DefaultProps";
import WPBlock from "../../abstract/wp/WPBlock";
import Sanitized from "../helpers/Sanitized";
import { getCssConstant, getRandomString, log } from "../../helpers/genericUtils";
import ParagraphBlock from "./ParagraphBlock";
import ImageBlock from "./ImageBlock";
import ColumnsBlock from "./ColumnsBlock";
import ColumnBlock from "./ColumnBlock";
import ImageSliderBlock from "./ImageSliderBlock";
import ParallaxBlock from "./ParallaxBlock";
import SpacerBlock from "./SpacerBlock";


interface Props extends DefaultProps {
    wpBlocks: WPBlock[]
}


/**
 * 
 * @since 0.0.1
 */
export default function Block({wpBlocks, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps);


    function renderBlocks(): JSX.Element[] {

        return wpBlocks.map(wpBlock => 
            getBlockByName(wpBlock))
    }
    
    
    /**
     * Get suitable component for given ```wpBlock```. If ```wpBlock.blockName``` is ```null``` return a ```<br />```.
     * 
     * Default is a simple ```<Sanitized />``` component which basically translates to a ```<div>```.
     * 
     * @param wpBlock to determine the right component for
     * @returns a suitable component for given wpBlock
     */
    function getBlockByName(wpBlock: WPBlock): JSX.Element {

        // set all blocks above parallax
        style!.zIndex = getCssConstant("zIndexBlock");

        switch (wpBlock.blockName) {
            case "core/paragraph":
                return <ParagraphBlock 
                            id={id}
                            className={className}
                            style={style}
                            key={getRandomString()}
                            wpBlock={wpBlock} 
                            mainTagNames={["p"]}
                        />

            case "core/heading":
                return <ParagraphBlock 
                            id={id}
                            className={className}
                            style={style}
                            key={getRandomString()} 
                            wpBlock={wpBlock} 
                            mainTagNames={["h1", "h2", "h3", "h4", "h5", "h6"]}
                        />

            case "core/image":
                return <ImageBlock 
                            id={id}
                            className={className}
                            style={style}
                            key={getRandomString()} 
                            wpBlock={wpBlock} 
                            mainTagNames={["img"]}
                        />;

            case "core/columns":
                return <ColumnsBlock 
                            id={id}
                            className={className}
                            style={style}
                            key={getRandomString()} 
                            wpBlock={wpBlock} 
                            numColumnBlocks={countColumnBlocks(wpBlock) || 0}
                        />;

            case "core/column":
                return <ColumnBlock 
                            id={id}
                            // change ColumnClock padding (initPadding()) when changing col-sm-6
                            className={className + " col-12 col-sm-6"}
                            style={style}
                            key={getRandomString()} 
                            wpBlock={wpBlock}
                        />

            case "core/spacer":
                return <SpacerBlock 
                            id={id}
                            className={className}
                            style={style}
                            key={getRandomString()} 
                            wpBlock={wpBlock}
                        />            

            case "carbon-fields/image-slider":
                return <ImageSliderBlock 
                            id={id}
                            className={className}
                            style={style}
                            wpBlock={wpBlock} 
                            key={getRandomString()} 
                            imageMarginRight="20px"
                            slideAmount={200}
                        />

            case "carbon-fields/hintergrund-bild":
                return <ParallaxBlock 
                            id={id}
                            className={className}
                            style={style}
                            wpBlock={wpBlock}
                            key={getRandomString()}
                        />

            // case: backend hides this page
            case null: 
                return <br key={getRandomString()} />;
        }

        return <Sanitized dirtyHTML={wpBlock.innerHTML} key={getRandomString()}>
                    <Block wpBlocks={wpBlock.innerBlocks} />
                </Sanitized>
    }


    /**
     * @param wpBlock to count "core/column" blocks from ```innerBlocks``` for
     * @returns number of ```innerBlocks``` with name "core/column" 
     */
    function countColumnBlocks(wpBlock: WPBlock): number | undefined {

        if (!wpBlock)
            return;

        return wpBlock.innerBlocks.map(innerBlock => innerBlock.blockName === "core/column")
                                  .length;
    }

    return (
        <>
            {renderBlocks()}

            {children}
        </>
    )
}